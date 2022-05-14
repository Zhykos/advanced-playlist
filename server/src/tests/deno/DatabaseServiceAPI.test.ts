import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { DatabaseServiceAPI } from "../../main/deno/services-api/DatabaseServiceAPI.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const databaseService: DatabaseServiceAPI = testsHelpers
    .createDatabaseService();

Deno.test("Get all videos", async () => {
    testsHelpers.createStubs();

    try {
        const allVideos: Array<Video> = await databaseService
            .getVideosFromDatabase();
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "database-video-01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "database-video-02");
        assertEquals(allVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Subscribe to a channel", async () => {
    testsHelpers.createStubs();

    try {
        const channel = new Channel();
        channel.id = "channel-000";
        channel.title = "Channel 000";
        assertEquals(channel._databaseId, undefined);

        const subscribedChannel: Channel = await databaseService
            .subscribeToChannel(channel);

        assertEquals(subscribedChannel, channel);
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Save videos", async () => {
    testsHelpers.createStubs();

    try {
        const videos = new Array<Video>();
        const video01 = new Video();
        video01.id = "video-001";
        video01.title = "Video 001";
        videos.push(video01);
        assertEquals(video01._databaseId, undefined);
        const video02 = new Video();
        video02.id = "video-002";
        video02.title = "Video 002";
        videos.push(video02);
        assertEquals(video02._databaseId, undefined);

        const savedVideos: Array<Video> = await databaseService
            .saveVideos(videos);

        assertEquals(savedVideos, videos);
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Save videos which already exist", async () => {
    testsHelpers.createStubs();

    try {
        const videos = new Array<Video>();
        const video01 = new Video();
        video01.id = "database-video-01";
        video01.title = "Video 001";
        videos.push(video01);
        assertEquals(video01._databaseId, undefined);
        const video02 = new Video();
        video02.id = "video-003";
        video02.title = "Video 003";
        videos.push(video02);
        assertEquals(video02._databaseId, undefined);

        const savedVideos: Array<Video> = await databaseService
            .saveVideos(videos);

        assertEquals(savedVideos.length, 1);
        assertEquals(savedVideos[0], video02);
    } finally {
        testsHelpers.resetStubs();
    }
});
