const vcf_keys = require('../etc/apikeys.json');

module.exports = {
    BROWSER_TEST: (process.env.BROWSER_TEST || 'chrome').trim(),
    SCREENSHOTS_TESTS: (process.env.SCREENSHOTS_TESTS || 'false').trim(),
    CLIENT_API_KEY: (
        process.env.CLIENT_API_KEY || vcf_keys.youtube.clientApiKey
    ).trim(),
    CLIENT_ID: (process.env.CLIENT_ID || vcf_keys.youtube.clientId).trim(),
};
