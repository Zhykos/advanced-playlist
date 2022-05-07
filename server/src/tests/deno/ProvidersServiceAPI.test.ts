import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { ProvidersServiceAPI } from "../../main/deno/services-api/ProvidersServiceAPI.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const providersService: ProvidersServiceAPI = testsHelpers
    .createProvidersService();

Deno.test("Fetch videos from youtube", async () => {
    testsHelpers.createStubs();

    try {
        const fetchVideos: Array<Video> = await providersService
            .getVideosFromProviders();
        assertEquals(fetchVideos.length, 2);
        assertEquals(fetchVideos[0].id, "youtube-video-01");
        assertEquals(fetchVideos[0].title, "Video 01");
        assertEquals(fetchVideos[1].id, "youtube-video-02");
        assertEquals(fetchVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});
