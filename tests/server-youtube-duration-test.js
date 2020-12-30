const helpers = require('../youtube-custom-feed/bin/vcf-server-helpers');

describe('Youtube duration into seconds tests', () => {

    test('1H', () => {
        expect(helpers.youtubeDurationIntoSeconds('1H')).toBe(1 * 60 * 60);
    });

    test('1H30M', () => {
        expect(helpers.youtubeDurationIntoSeconds('1H30M')).toBe(1 * 60 * 60 + 30 * 60);
    });

    test('1H30M15S', () => {
        expect(helpers.youtubeDurationIntoSeconds('1H30M15S')).toBe(1 * 60 * 60 + 30 * 60 + 15);
    });

    test('30M', () => {
        expect(helpers.youtubeDurationIntoSeconds('30M')).toBe(30 * 60);
    });

    test('15S', () => {
        expect(helpers.youtubeDurationIntoSeconds('15S')).toBe(15);
    });

    test('Inverted format youtubeDurationIntoSeconds (30M1H)', () => {
        expect(helpers.youtubeDurationIntoSeconds('30M1H')).toBe(1 * 60 * 60 + 30 * 60);
    });

    test('Wrong format youtubeDurationIntoSeconds (30Z)', () => {
        expect(helpers.youtubeDurationIntoSeconds('30Z')).toBe(-1);
    });

    test('Strange format youtubeDurationIntoSeconds (30M30M)', () => {
        expect(helpers.youtubeDurationIntoSeconds('30M30M')).toBe(60 * 60);
    });

    test('Wrong and right format youtubeDurationIntoSeconds (30M30Z)', () => {
        expect(helpers.youtubeDurationIntoSeconds('30M30Z')).toBe(30 * 60);
    });

    test('0S', () => {
        expect(helpers.youtubeDurationIntoSeconds('0S')).toBe(0);
    });

    test('No parameter youtubeDurationIntoSeconds ()', () => {
        expect(helpers.youtubeDurationIntoSeconds()).toBe(-1);
    });

    test('Number parameter youtubeDurationIntoSeconds (4)', () => {
        expect(helpers.youtubeDurationIntoSeconds(4)).toBe(-1);
    });

});