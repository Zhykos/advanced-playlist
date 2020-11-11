const rewire = require('rewire');
const helpers = rewire('../youtube-custom-feed/vcf-server-helpers');
var youtubeDurationIntoSeconds = helpers.__get__('youtubeDurationIntoSeconds');

test('youtubeDurationIntoSeconds (1H)', () => {
    expect(youtubeDurationIntoSeconds('1H')).toBe(1 * 60 * 60);
});