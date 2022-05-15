import { assertEquals, resolvesNext, stub } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { ProvidersServiceAPI } from "../../main/deno/services-api/ProvidersServiceAPI.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const providersService: ProvidersServiceAPI = testsHelpers
    .createProvidersService();

Deno.test("Fetch videos from youtube", async () => {
    testsHelpers.createStubs();

    try {
        const fetchVideos: Video[] = await providersService
            .getVideosFromSubscribedProviders();
        assertEquals(fetchVideos.length, 2);
        assertEquals(fetchVideos[0].id, "youtube-video-01");
        assertEquals(fetchVideos[0].title, "Video 01");
        assertEquals(fetchVideos[1].id, "youtube-video-02");
        assertEquals(fetchVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Search channel on youtube", async () => {
    testsHelpers.createStubs();

    try {
        const channels: Channel[] = await providersService
            .searchChannelFromProviders("");
        assertEquals(channels.length, 1);
        assertEquals(channels[0].id, "youtube-channel-01");
        assertEquals(channels[0].title, "Channel 01");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Fetch videos from youtube without any subscribed channel", async () => {
    const stubFindChannels = stub(
        testsHelpers.mongo.channelsCollection,
        "find",
        resolvesNext([[]]),
    );

    try {
        const fetchVideos: Video[] = await providersService
            .getVideosFromSubscribedProviders();
        assertEquals(fetchVideos.length, 0);
    } finally {
        stubFindChannels.restore();
    }
});
