const server = require('../youtube-custom-feed/ycf-server');

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

describe('Path: swap visibility tests', () => {

    beforeAll(() => {
        fs.unlinkSync('./tests/resources/db-tests-for-modification-01.temp');
        fs.unlinkSync('./tests/resources/db-tests-for-modification-02.temp');
        fs.unlinkSync('./tests/resources/db-tests-for-modification-03.temp');

        fs.copyFileSync('./tests/resources/db-tests-for-modification.json', './tests/resources/db-tests-for-modification-01.temp');
        fs.copyFileSync('./tests/resources/db-tests-for-modification.json', './tests/resources/db-tests-for-modification-02.temp');
    });

    afterAll(() => {
        jest.clearAllMocks();
        fs.unlinkSync('./tests/resources/db-tests-for-modification-01.temp');
        fs.unlinkSync('./tests/resources/db-tests-for-modification-02.temp');
        fs.unlinkSync('./tests/resources/db-tests-for-modification-03.temp');
    });

    test('Swap', () => {
        const videoIdToSwap = "video-01";
        const request = { "body": { "videoId": videoIdToSwap } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-01.temp');

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: videoIdToSwap }).value()[0].videoTitle).toBe("Video 01");
        expect(dbTests.get('videos').filter({ videoId: videoIdToSwap }).value()[0].visible).toBe(true);
        expect(dbTests.get('channels').size().value()).toBe(1);
        expect(dbTests.get('channels').filter({ channelId: "channel-01" }).value()[0].channelTitle).toBe("Channel 01");

        server.path_swapVisibility(request, response);

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: videoIdToSwap }).value()[0].visible).toBe(false);
        expect(dbTests.get('channels').size().value()).toBe(1);
    });

    test('Video does not exist', () => {
        const videoIdToSwap = "video-foo";
        const request = { "body": { "videoId": videoIdToSwap } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-02.temp');

        expect(dbTests.get('videos').size().value()).toBe(1);
        expect(dbTests.get('videos').filter({ videoId: videoIdToSwap }).size().value()).toBe(0);

        server.path_swapVisibility(request, response);

        expect(response.status).toHaveBeenCalledWith(500);
    });

    test('Empty database', () => {
        const videoIdToSwap = "video-foo";
        const request = { "body": { "videoId": videoIdToSwap } };
        const response = mockResponse();

        const dbTests = openDB('db-tests-for-modification-03.temp');

        expect(dbTests.get('videos').size().value()).toBe(0);

        server.path_swapVisibility(request, response);

        expect(response.status).toHaveBeenCalledWith(500);
    });

});
