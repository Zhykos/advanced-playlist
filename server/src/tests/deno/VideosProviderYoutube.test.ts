import { assertEquals, assertRejects, resolvesNext, stub } from "./deps.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { IVideosProvider } from "../../main/deno/videos-provider/IVideosProvider.ts";
import { YouTube } from "../../main/deno/videos-provider/impl/deps.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const videosProvider: IVideosProvider = testsHelpers.createVideosProvider();

Deno.test("Get videos from a channel", async () => {
    testsHelpers.createStubs();

    try {
        const channel = new Channel();
        channel.id = "channel-01";
        const allVideos: Video[] = await videosProvider
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
        const channels: Channel[] = await videosProvider
            .getChannels("");
        assertEquals(channels.length, 1);
        assertEquals(channels[0].id, "youtube-channel-01");
        assertEquals(channels[0].title, "Channel 01");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Get videos from a channel error", async () => {
    const youtubeApi: YouTube = testsHelpers.getYoutubeAPI();
    const specificStub = stub(
        youtubeApi,
        "search_list",
        resolvesNext([{}]),
    );

    try {
        const channel = new Channel();
        channel.id = "channel-01";
        assertRejects(() =>
            videosProvider
                .getVideosFromChannel(channel)
        );
    } finally {
        specificStub.restore();
        testsHelpers.resetStubs();
    }
});

Deno.test("Search a channel which does not exist", async () => {
    const youtubeApi: YouTube = testsHelpers.getYoutubeAPI();
    const specificStub = stub(
        youtubeApi,
        "channels_list",
        resolvesNext([{}]),
    );

    try {
        const channels: Channel[] = await videosProvider
            .getChannels("");
        assertEquals(channels.length, 0);
    } finally {
        specificStub.restore();
        testsHelpers.resetStubs();
    }
});
