const helpers = require('../youtube-custom-feed/vcf-server-helpers');

describe('Set filter status tests', () => {

    test('No channel found', () => {
        const video = { "channelId": "foo" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.NONE);
    });

    test('id_nolist', () => {
        const video = { "channelId": "id_nolist" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.NONE);
    });

    test('id_onewhite', () => {
        const video = { "channelId": "id_onewhite", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
    });

    test('id_twowhite', () => {
        const video = { "channelId": "id_twowhite", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
    });

    test('id_severalwhitewrong', () => {
        const video = { "channelId": "id_severalwhitewrong", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.NONE);
    });

    test('id_whitenomatch', () => {
        const video = { "channelId": "id_whitenomatch", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.NONE);
    });

    test('id_oneblack', () => {
        const video = { "channelId": "id_oneblack", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
    });

    test('id_twoblack', () => {
        const video = { "channelId": "id_twoblack", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
    });

    test('id_blacknomatch', () => {
        const video = { "channelId": "id_blacknomatch", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBe(helpers.filterStatus.NONE);
    });

    test('no param', () => {
        const video = { "channelId": "id_blacknomatch", "videoTitle": "Hello foo!" };
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus();
        expect(video.filter).toBeUndefined();
    });

    test('wrong param', () => {
        const video = {};
        expect(video.filter).toBeUndefined();
        helpers.setFilterStatus(video);
        expect(video.filter).toBeUndefined();
    });

});