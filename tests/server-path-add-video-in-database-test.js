const server = require('../youtube-custom-feed/bin/vcf-server');
const helpers = require('./tests-helpers');

const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const mockResponse = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.end = jest.fn().mockReturnValue(response);
    response.render = jest.fn().mockImplementation((page, values) => {
        response.page = page;
        response.values = values;
        return response;
    });
    return response;
};

function openDB(filename) {
    jest.clearAllMocks();
    const adapter = new FileSync('./tests/resources/' + filename);
    const dbTests = lowdb(adapter);
    dbTests.defaults({ videos: [] }).write();
    dbTests.defaults({ channels: [] }).write();
    jest.spyOn(server.db, "get").mockImplementation(getWhat => dbTests.get(getWhat));
    jest.spyOn(server.db, "has").mockImplementation(getWhat => dbTests.has(getWhat));
    return dbTests;
}

describe('Path: Add video in database', () => {

    beforeAll(() => {
        helpers.deleteFile('./tests/resources/db-tests-for-modification-01.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-02.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-03.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-04.temp');

        fs.copyFileSync('./tests/resources/db-tests-for-modification.json', './tests/resources/db-tests-for-modification-01.temp');
        fs.copyFileSync('./tests/resources/db-tests-for-modification.json', './tests/resources/db-tests-for-modification-02.temp');
        fs.copyFileSync('./tests/resources/db-tests-for-modification.json', './tests/resources/db-tests-for-modification-04.temp');
    });

    afterAll(() => {
        jest.clearAllMocks();
        helpers.deleteFile('./tests/resources/db-tests-for-modification-01.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-02.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-03.temp');
        helpers.deleteFile('./tests/resources/db-tests-for-modification-04.temp');
    });

    test('Add new video', () => {
        const channelId = "channel-01";
        const videoIdToAdd = "video-02";
        const videoTitleToAdd = "Video 02";
        const request = { "body": { "videoDuration": "1H12M", "channelId": channelId, "videoId": videoIdToAdd, "videoTitle": videoTitleToAdd } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-01.temp');

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: 'video-01' }).value()[0].videoTitle).toBe("Video 01");
        expect(dbTests.get('channels').size().value()).toBe(1);
        expect(dbTests.get('channels').filter({ channelId: channelId }).value()[0].channelTitle).toBe("Channel 01");

        server.path_addVideoInDatabase(request, response);

        expect(dbTests.get('videos').size().value()).toBe(2);
        expect(dbTests.get('videos').filter({ videoId: 'video-01' }).value()[0].videoTitle).toBe("Video 01");
        expect(dbTests.get('videos').filter({ videoId: videoIdToAdd }).value()[0].videoTitle).toBe(videoTitleToAdd);
        expect(dbTests.get('videos').filter({ videoId: videoIdToAdd }).value()[0].videoDuration).toBe(4320);
        expect(dbTests.get('channels').size().value()).toBe(1);
    });

    test('Add new video from new channel', () => {
        const channelIdToAdd = "channel-02";
        const channelTitleToAdd = "Channel 02";
        const request = { "body": { "videoDuration": "1H12M", "channelId": channelIdToAdd, "videoId": "video-03", "videoTitle": "Video 03", "channelTitle": channelTitleToAdd } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-02.temp');

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('channels').size().value()).toBe(1);

        server.path_addVideoInDatabase(request, response);

        expect(dbTests.get('videos').size().value()).toBe(2);
        expect(dbTests.get('channels').size().value()).toBe(2);
        expect(dbTests.get('channels').filter({ channelId: channelIdToAdd }).value()[0].channelTitle).toBe(channelTitleToAdd);
    });

    test('Add new video, empty database', () => {
        const videoIdToAdd = "video-01";
        const videoTitleToAdd = "Video 01";
        const channelIdToAdd = "channel-02";
        const channelTitleToAdd = "Channel 02";
        const request = { "body": { "videoDuration": "1H12M", "channelId": channelIdToAdd, "channelTitle": channelTitleToAdd, "videoId": videoIdToAdd, "videoTitle": videoTitleToAdd } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-03.temp');

        expect(dbTests.get('videos').size().value()).toBe(0);
        expect(dbTests.get('channels').size().value()).toBe(0);

        server.path_addVideoInDatabase(request, response);

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('channels').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: videoIdToAdd }).value()[0].videoTitle).toBe(videoTitleToAdd);
        expect(dbTests.get('channels').filter({ channelId: channelIdToAdd }).value()[0].channelTitle).toBe(channelTitleToAdd);
    });

    test('Add new video, already exists', () => {
        const dbTests = openDB('db-tests-for-modification-04.temp');
        const videoIdToAdd = "video-01";
        const videoTitleToAdd = "Video 01";
        const channelIdToAdd = "channel-01";
        const channelTitleToAdd = "Channel 01";
        const request = { "body": { "videoDuration": "1H12M", "channelId": channelIdToAdd, "channelTitle": channelTitleToAdd, "videoId": videoIdToAdd, "videoTitle": videoTitleToAdd } };
        const response = mockResponse();

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('channels').size().value()).toBe(1);

        server.path_addVideoInDatabase(request, response);

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('channels').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: videoIdToAdd }).value()[0].videoTitle).toBe(videoTitleToAdd);
        expect(dbTests.get('channels').filter({ channelId: channelIdToAdd }).value()[0].channelTitle).toBe(channelTitleToAdd);
    });

});
