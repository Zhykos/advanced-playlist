import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
const videosService: VideosService = testsHelpers.createVideosService();

Deno.test("Get all videos", async () => {
    testsHelpers.createStubs();

    try {
        const allVideos: Array<Video> = await videosService.getVideos();
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "database-video-01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "database-video-02");
        assertEquals(allVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Fetch videos from youtube", async () => {
    testsHelpers.createStubs();

    try {
        const fetchVideos: Array<Video> = await videosService.fetchVideos();
        assertEquals(fetchVideos.length, 2);
        assertEquals(fetchVideos[0].id, "youtube-video-01");
        assertEquals(fetchVideos[0].title, "Video 01");
        assertEquals(fetchVideos[1].id, "youtube-video-02");
        assertEquals(fetchVideos[1].title, "Video 02");
    } finally {
        testsHelpers.resetStubs();
    }
});
