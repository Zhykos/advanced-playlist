const server = require('../youtube-custom-feed/bin/server/javascripts/vcf-server');
const helpers = require('../youtube-custom-feed/bin/server/javascripts/vcf-server-helpers');

const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const mockResponse = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.render = jest.fn().mockImplementation((page, values) => {
        response.page = page;
        response.values = values;
        return response;
    });
    return response;
};

const adapter = new FileSync('./tests/resources/db-tests.json');
const dbTests = lowdb(adapter);
dbTests.defaults({ videos: [] }).write();
dbTests.defaults({ channels: [] }).write();

describe('Path: Root', () => {

    beforeAll(() => {
        jest.spyOn(server.db, "get").mockImplementation(getWhat => dbTests.get(getWhat));
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test('Default call', () => {
        const request = { "query": {} };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.render).toHaveBeenCalled();
        expect(response.page).toBe("index");
        expect(response.values.videos.length).toBe(dbTests.get('videos').filter({ visible: true, filter: helpers.filterStatus.NONE }).size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.displayHiddenVideos).toBe("false");
        expect(response.values.channel).toBeUndefined();
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Display hidden videos', () => {
        const request = { "query": { "hidden": "true" } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(dbTests.get('videos').size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.displayHiddenVideos).toBe("true");
        expect(response.values.channel).toBeUndefined();
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Do not display hidden videos', () => {
        const request = { "query": { "hidden": "false" } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.render).toHaveBeenCalled();
        expect(response.page).toBe("index");
        expect(response.values.videos.length).toBe(dbTests.get('videos').filter({ visible: true, filter: helpers.filterStatus.NONE }).size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.displayHiddenVideos).toBe("false");
        expect(response.values.channel).toBeUndefined();
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Wrong hidden parameter', () => {
        const request = { "query": { "hidden": "foo" } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(0);
    });

    test('Display all channels', () => {
        const channel = "all";
        const request = { "query": { "channel": channel } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(dbTests.get('videos').filter({ visible: true, filter: helpers.filterStatus.NONE }).size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.channel).toBe(channel);
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Wrong channel parameter', () => {
        const channel = "foo";
        const request = { "query": { "channel": channel } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(0);
        expect(response.values.channels.length).toBe(0);
        expect(response.values.channel).toBe(channel);
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Wrong channel parameter TRUE', () => {
        const channel = "true";
        const request = { "query": { "channel": channel } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(0);
        expect(response.values.channels.length).toBe(0);
        expect(response.values.channel).toBe(channel);
        expect(response.values.channelTitle).toBeUndefined();
    });

    test('Display channel 01', () => {
        const channel = "channel-01";
        const request = { "query": { "channel": channel } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(dbTests.get('videos').filter({ visible: true, channelId: channel, filter: helpers.filterStatus.NONE }).size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.channel).toBe(channel);
        expect(response.values.channelTitle).toBe("Channel 01");
    });

    test('Display all videos from channel 01', () => {
        const channel = "channel-01";
        const request = { "query": { "channel": channel, "hidden": "true" } };
        const response = mockResponse();

        server.pathRoot(request, response);

        expect(response.values.videos.length).toBe(dbTests.get('videos').filter({ channelId: channel }).size().value());
        expect(response.values.channels.length).toBe(dbTests.get('channels').size().value());
        expect(response.values.channel).toBe(channel);
        expect(response.values.channelTitle).toBe("Channel 01");
    });

});
