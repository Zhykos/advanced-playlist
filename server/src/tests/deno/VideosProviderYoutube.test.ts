import { assertEquals } from "./deps.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { IVideosProvider } from "../../main/deno/videos-provider/IVideosProvider.ts";

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
const videosProvider: IVideosProvider = testsHelpers.createVideosProvider();

Deno.test("Get channel", async () => {
    const getYoutubeChannelStub = testsHelpers
        .createStubForGettingChannelFromYoutube();
    const getAuthProviderStub = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();

    try {
        const channel: Channel = await videosProvider.getChannel(
            "Channel 01",
        );
        assertEquals("channel", channel.id);
        assertEquals("Channel 01", channel.title);
    } finally {
        getYoutubeChannelStub.restore();
        getAuthProviderStub.restore();
    }
});

Deno.test("Get videos from a channel", async () => {
    const stub1 = testsHelpers
        .createStubForGettingChannelFromYoutube();
    const stub2 = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();
    const stub3 = testsHelpers
        .createStubForGettingVideosFromChannelFromYoutube();

    try {
        const channel = new Channel();
        channel.id = "channel-01";
        const allVideos: Array<Video> = await videosProvider
            .getVideosFromChannel(channel);
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "video-01-channel-01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "video-02-channel-01");
        assertEquals(allVideos[1].title, "Video 02");
    } finally {
        stub1.restore();
        stub2.restore();
        stub3.restore();
    }
});
