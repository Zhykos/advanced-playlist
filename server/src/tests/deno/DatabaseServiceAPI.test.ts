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
        const channel: Channel = new Channel();
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
