/**
 * Sample JavaScript code for youtube.channels.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
    .then(function () { console.log("Sign-in successful"); },
      function (err) { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey(ycf.clientApiKey);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () { console.log("GAPI client loaded for API"); },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.youtube.channels.list({
    "part": "contentDetails",
    "id": ycf.channels[0].id
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      // console.log("Response", response);
      var uploadId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
      gapi.client.youtube.playlistItems.list({
        "part": "contentDetails",
        "playlistId": uploadId,
        "maxResults": 50
      }).then(function (response) {
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
        var videoId = response.result.items[0].contentDetails.videoId;
        gapi.client.youtube.videos.list({
          "part": "contentDetails,player,snippet",
          "id": videoId
        }).then(function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          $("#videos").html(generateHTMLFrom(response));
        },
          function (err) { console.error("Execute error", err); });
      },
        function (err) { console.error("Execute error", err); });
    },
      function (err) { console.error("Execute error", err); });
}

function generateHTMLFrom(googleAPIResponse) {
  const videoThumbnailSrc = googleAPIResponse.result.items[0].snippet.thumbnails.default.url;
  const videoTitle = googleAPIResponse.result.items[0].snippet.title;
  const channelTitle = googleAPIResponse.result.items[0].snippet.channelTitle;
  const videoPlayer = googleAPIResponse.result.items[0].player.embedHtml;
  var html = `<img src='${videoThumbnailSrc}' /> ${videoTitle} ${channelTitle} ${videoPlayer}`;
  return html;
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: ycf.clientId });
});