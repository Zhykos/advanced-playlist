function readTextFile() {
  var jsonText = null;
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", "../youtube-custom-feed/parameters.json", false);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        jsonText = rawFile.responseText;
      }
  }
  rawFile.send(null);
  return jsonText;
}

const ycfJson = readTextFile();
const ycf = JSON.parse(ycfJson);

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
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
      }
    );
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
    }
  );
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
    }
  );
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
          videoDuration: video.contentDetails.duration,
          channelId: video.snippet.channelId,
          publishDate: video.snippet.publishedAt,
          visible: true
        };
        $.post("/addVideoInDatabase", videoData,
          function (data) {
            console.log("ok");
          }
        );
      }
    },
    function (err) {
      console.error("Execute error", err);
    }
  );
}

gapi.load("client:auth2",
  function () {
    gapi.auth2.init({ client_id: ycf.clientId });
  }
);

function displayIframeVideoPlayer(videoId) {
  const iframe = `<iframe width="480" height="270" src="//www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  $("#iframe").html(iframe);
  $("#popup").fadeIn('slow');
}

function swapVisibility(videoId) {
  $.post("/swapVisibility", { videoId: videoId })
    .done(
      function (data) {
        if ($("#img_" + videoId).hasClass("hiddenImage")) {
          $("#img_" + videoId).removeClass("hiddenImage");
          $("#title_" + videoId).removeClass("hiddenText");
          $("#channel_" + videoId).removeClass("hiddenText");
          $("#swap_" + videoId).attr("src", "images/hide.png");
          $("#swap_" + videoId).attr("title", "Hide this video");
        } else {
          $("#img_" + videoId).addClass("hiddenImage");
          $("#title_" + videoId).addClass("hiddenText");
          $("#channel_" + videoId).addClass("hiddenText");
          $("#swap_" + videoId).attr("src", "images/visible.png");
          $("#swap_" + videoId).attr("title", "Set this video as visible");
        }
        console.log("ok");
      }
    )
    .fail(
      function (data) {
        console.log("KO");
      }
    );
}

function displayIframeVideoPlayerThenMask(videoId) {
  displayIframeVideoPlayer(videoId);
  swapVisibility(videoId);
}

function openOnYoutube(videoId) {
  const win = window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  win.focus();
}
