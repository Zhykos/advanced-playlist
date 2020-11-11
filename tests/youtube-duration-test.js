/*const rewire = require('rewire');
const helpers = rewire('../youtube-custom-feed/vcf-server-helpers');
var youtubeDurationIntoSeconds = helpers.__get__('youtubeDurationIntoSeconds');*/
const helpers = require('../youtube-custom-feed/vcf-server-helpers');

test('youtubeDurationIntoSeconds (1H)', () => {
    expect(helpers.youtubeDurationIntoSeconds('1H')).toBe(1 * 60 * 60);
});

test('youtubeDurationIntoSeconds (1H30M)', () => {
    expect(helpers.youtubeDurationIntoSeconds('1H30M')).toBe(1 * 60 * 60 + 30 * 60);
});

test('youtubeDurationIntoSeconds (1H30M15S)', () => {
    expect(helpers.youtubeDurationIntoSeconds('1H30M15S')).toBe(1 * 60 * 60 + 30 * 60 + 15);
});

test('youtubeDurationIntoSeconds (30M)', () => {
    expect(helpers.youtubeDurationIntoSeconds('30M')).toBe(30 * 60);
});

test('youtubeDurationIntoSeconds (15S)', () => {
    expect(helpers.youtubeDurationIntoSeconds('15S')).toBe(15);
});

test('inverted format youtubeDurationIntoSeconds (30M1H)', () => {
    expect(helpers.youtubeDurationIntoSeconds('30M1H')).toBe(1 * 60 * 60 + 30 * 60);
});

test('wrong format youtubeDurationIntoSeconds (30Z)', () => {
    expect(helpers.youtubeDurationIntoSeconds('30Z')).toBe(-1);
});

test('strange format youtubeDurationIntoSeconds (30M30M)', () => {
    expect(helpers.youtubeDurationIntoSeconds('30M30M')).toBe(60 * 60);
});

test('wrong and right format youtubeDurationIntoSeconds (30M30Z)', () => {
    expect(helpers.youtubeDurationIntoSeconds('30M30Z')).toBe(30 * 60);
});

test('youtubeDurationIntoSeconds (0S)', () => {
    expect(helpers.youtubeDurationIntoSeconds('0S')).toBe(0);
});

test('no parameter youtubeDurationIntoSeconds ()', () => {
    expect(helpers.youtubeDurationIntoSeconds()).toBe(-1);
});

test('number parameter youtubeDurationIntoSeconds (4)', () => {
    expect(helpers.youtubeDurationIntoSeconds(4)).toBe(-1);
});