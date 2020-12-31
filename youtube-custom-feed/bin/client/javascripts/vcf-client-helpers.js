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

function loadClient(callback) {
  gapi.client.setApiKey(ycf.clientApiKey);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        console.log("Google API client loaded");
        $("#fetch").show();
        $("#connection").hide();
        if (callback) {
          callback();
        }
      },
      function (err) {
        console.error("Error loading Google API client", err);
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
    "part": "contentDetails,snippet",
    "id": channelId
  }).then(
    function (response) {
      const items = response.result.items;
      if (items.length == 0) {
        console.error(`No playlist found on channel '${channelId}'.`);
      } else {
        insertDataFromUploadedPlaylist(items[0].contentDetails.relatedPlaylists.uploads, items[0].snippet.thumbnails.default.url)
      }
    },
    function (err) {
      console.error("Execute error", err);
    }
  );
}

function insertDataFromUploadedPlaylist(uploadPlaylistId, channelIconUrl) {
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
        videoItems.forEach(video => insertDataFromVideoId(video.contentDetails.videoId, channelIconUrl));
      }
    },
    function (err) {
      console.error("Execute error", err);
    }
  );
}

function insertDataFromVideoId(videoId, channelIconUrl) {
  gapi.client.youtube.videos.list({
    "part": "contentDetails,player,snippet",
    "id": videoId
  }).then(
    function (response) {
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
          visible: true,
          channelImage: channelIconUrl
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

function displayIframeVideoPlayer(videoId) {
  const iframe = `<iframe width="480" height="270" src="//www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  $("#iframe").html(iframe);
  $("#popup").fadeIn('slow');
}

function swapVisibility(videoId, displayHiddenVideos) {
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
  if (displayHiddenVideos != "true" && displayHiddenVideos != true) {
    $("#video_" + videoId).hide();
  }
}

function displayIframeVideoPlayerThenMask(videoId, displayHiddenVideos) {
  displayIframeVideoPlayer(videoId);
  swapVisibility(videoId, displayHiddenVideos);
}

function openOnYoutube(videoId) {
  const win = window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  win.focus();
}

function displayHiddenVideos() {
  const parameters = getParametersFromUrl();
  parameters.hidden = "true";
  reloadCurrentPageWithParameters(parameters);
}

function hideMaskedVideos() {
  const parameters = getParametersFromUrl();
  parameters.hidden = "false";
  reloadCurrentPageWithParameters(parameters);
}

function reloadCurrentPageWithParameters(parameters) {
  var newUrl = window.location.protocol + "//" + window.location.host;
  if (parameters) {
    const params = [];
    Object.keys(parameters).forEach(function (key) {
      params.push(key + '=' + parameters[key]);
    });
    newUrl += "?" + params.join("&");
  }
  window.location.href = newUrl;
}

function displayVideosFromChannel(channelId) {
  const parameters = getParametersFromUrl();
  if ("#all" == channelId) {
    parameters.channel = "all";
  } else {
    parameters.channel = channelId;
  }
  reloadCurrentPageWithParameters(parameters);
}

// https://stackoverflow.com/a/8486188
function getParametersFromUrl() {
  const url = window.location.search;
  const query = url.substr(1);
  const result = {};
  query.split("&").forEach(part => {
    if (part) {
      const item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    }
  });
  return result;
}
