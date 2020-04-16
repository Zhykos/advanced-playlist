function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      });
}

function loadClient() {
  gapi.client.setApiKey(ycf.clientApiKey);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      });
}

function execute() {
  if (ycf.channels.length == 0) {
    console.error("No custom channel, check file 'youtube-custom-feed/parameters.js'.");
  } else {
    ycf.channels.forEach(channel => insertDataFromChannel(channel.id));
  }
}

function insertDataFromChannel(channelId) {
  gapi.client.youtube.channels.list({
    "part": "contentDetails",
    "id": channelId
  }).then(
    function (response) {
      const uploadItems = response.result.items;
      if (uploadItems.length == 0) {
        console.error(`No playlist found on channel '${channelId}'.`);
      } else {
        insertDataFromUploadedPlaylist(uploadItems[0].contentDetails.relatedPlaylists.uploads)
      }
    },
    function (err) {
      console.error("Execute error", err);
    });
}

function insertDataFromUploadedPlaylist(uploadPlaylistId) {
  gapi.client.youtube.playlistItems.list({
    "part": "contentDetails",
    "playlistId": uploadPlaylistId,
    "maxResults": 50
  }).then(
    function (response) {
      const videoItems = response.result.items;
      if (videoItems.length == 0) {
        console.error(`No video found on playlist '${uploadPlaylistId}'.`);
      } else {
        videoItems.forEach(video => insertDataFromVideoId(video.contentDetails.videoId));
      }
    },
    function (err) {
      console.error("Execute error", err);
    });
}

function insertDataFromVideoId(videoId) {
  gapi.client.youtube.videos.list({
    "part": "contentDetails,player,snippet",
    "id": videoId
  }).then(
    function (response) {
      //console.log("Response", response);
      //const html = generateHTMLFrom(response);
      //$("#videos").append(html);
      const videoItems = response.result.items;
      if (videoItems.length == 0) {
        console.error(`No video found with ID '${videoId}'.`);
      } else {
        const video = videoItems[0];
        const videoData = {
          videoId: videoId,
          videoThumbnailSrc: video.snippet.thumbnails.default.url,
          videoTitle: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          videoPlayer: video.player.embedHtml,
          channelId: video.snippet.channelId,
          publishDate: video.snippet.publishedAt
        };
        $.post("/addVideoInDatabase", videoData,
          function (data) {
            console.log("ok");
          });
      }
    },
    function (err) {
      console.error("Execute error", err);
    });
}

function generateHTMLFrom(googleAPIResponse) {
  const videoThumbnailSrc = googleAPIResponse.result.items[0].snippet.thumbnails.default.url;
  const videoTitle = googleAPIResponse.result.items[0].snippet.title;
  const channelTitle = googleAPIResponse.result.items[0].snippet.channelTitle;
  const videoPlayer = googleAPIResponse.result.items[0].player.embedHtml;
  return `<img src='${videoThumbnailSrc}' /> ${videoTitle} ${channelTitle} ${videoPlayer}`;
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: ycf.clientId });
});