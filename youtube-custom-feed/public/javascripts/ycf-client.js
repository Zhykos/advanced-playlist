var ycf;

readTextFile(function (ycfJson) {
  ycf = JSON.parse(ycfJson);

  gapi.load("client:auth2",
    function () {
      gapi.auth2.init({ client_id: ycf.clientId });
    }
  );

  $("#loading").hide();
  $("#contents").show();
});