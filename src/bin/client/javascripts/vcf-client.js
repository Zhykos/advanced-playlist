var vcf;

function init() {
    $.post('/getParameters')
        .done(function(res) {
            vcf = res;
            if (
                vcf.clientApiKey == '<XXX>' ||
                vcf.clientId == '<YYY>.apps.googleusercontent.com'
            ) {
                $('#loading').hide();
                $('#contents').show();
                $('#settings-error').show();
                $('#connection').hide();
            } else {
                gapi.load('client:auth2', function() {
                    gapi.auth2
                        .init({ client_id: vcf.clientId })
                        .then(function() {
                            const GoogleAuth = gapi.auth2.getAuthInstance();
                            if (GoogleAuth.isSignedIn.get()) {
                                loadClient(function() {
                                    $('#loading').hide();
                                    $('#contents').show();
                                });
                            } else {
                                $('#fetch').hide();
                                $('#connection').show();
                                $('#loading').hide();
                                $('#contents').show();
                            }
                        });
                });
            }
        })
        .fail(function(data) {
            console.error("Error getting API parameters: " + data);
        });
}
exports.init = init;