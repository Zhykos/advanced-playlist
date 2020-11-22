const helpers = require('../youtube-custom-feed/vcf-server-helpers');

test('setFilterStatus (no channel found)', () => {
    const video = { "channelId": "foo" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.NONE);
});

test('setFilterStatus (id_nolist)', () => {
    const video = { "channelId": "id_nolist" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.NONE);
});

test('setFilterStatus (id_onewhite)', () => {
    const video = { "channelId": "id_onewhite", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
});

test('setFilterStatus (id_twowhite)', () => {
    const video = { "channelId": "id_twowhite", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
});

test('setFilterStatus (id_severalwhitewrong)', () => {
    const video = { "channelId": "id_severalwhitewrong", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.NONE);
});

test('setFilterStatus (id_whitenomatch)', () => {
    const video = { "channelId": "id_whitenomatch", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.NONE);
});

test('setFilterStatus (id_oneblack)', () => {
    const video = { "channelId": "id_oneblack", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
});

test('setFilterStatus (id_twoblack)', () => {
    const video = { "channelId": "id_twoblack", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
});

test('setFilterStatus (id_blacknomatch)', () => {
    const video = { "channelId": "id_blacknomatch", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBe(helpers.filterStatus.NONE);
});

test('setFilterStatus (no param)', () => {
    const video = { "channelId": "id_blacknomatch", "videoTitle": "Hello foo!" };
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus();
    expect(video.filter).toBeUndefined();
});

test('setFilterStatus (wrong param)', () => {
    const video = {};
    expect(video.filter).toBeUndefined();
    helpers.setFilterStatus(video);
    expect(video.filter).toBeUndefined();
});