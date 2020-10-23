var ycf;

readTextFile(function (ycfJson) {
  ycf = JSON.parse(ycfJson);
  if (ycf) {
    if (ycf.clientApiKey == "<XXX>" || ycf.clientId == "<YYY>.apps.googleusercontent.com") {
      $("#loading").hide();
      $("#contents").show();
      $("#settings-error").show();
      $("#connection").hide();
    } else {
      gapi.load("client:auth2",
        function () {
          gapi.auth2.init({ client_id: ycf.clientId }).then(
            function () {
              const GoogleAuth = gapi.auth2.getAuthInstance();
              if (GoogleAuth.isSignedIn.get()) {
                loadClient(function () {
                  $("#loading").hide();
                  $("#contents").show();
                });
              } else {
                $("#fetch").hide();
                $("#connection").show();
                $("#loading").hide();
                $("#contents").show();
              }
            });
        }
      );
    }
  }
});