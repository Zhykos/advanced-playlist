import { assertEquals } from "./deps.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { IVideosProvider } from "../../main/deno/videos-provider/IVideosProvider.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const videosProvider: IVideosProvider = testsHelpers.createVideosProvider();

Deno.test("Get videos from a channel", async () => {
    testsHelpers.createStubs();

    try {
        const channel = new Channel();
        channel.id = "channel-01";
        const allVideos: Array<Video> = await videosProvider
            .getVideosFromChannel(channel);
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "youtube-video-01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "youtube-video-02");
        assertEquals(allVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Search a channel", async () => {
    testsHelpers.createStubs();

    try {
        const channels: Array<Channel> = await videosProvider
            .getChannels("");
        assertEquals(channels.length, 1);
        assertEquals(channels[0].id, "youtube-channel-01");
        assertEquals(channels[0].title, "Channel 01");
    } finally {
        testsHelpers.resetStubs();
    }
});
