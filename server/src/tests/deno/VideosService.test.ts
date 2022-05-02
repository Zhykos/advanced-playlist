import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";

const testsHelpers = await TestsHelpers.createInstance();
const videosService = new VideosService(
    testsHelpers.getStubbedVideosDatabaseMongoDbAtlas(),
    testsHelpers.getStubbedVideosProviderYoutube(),
);

Deno.test("Get all videos", async () => {
    const getAllVideosStub = testsHelpers
        .createStubForGettingAllVideosFromDatabase();
    const getAuthProviderStub = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();

    try {
        const allVideos: Array<Video> = await videosService.getVideos();
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "video_01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "video_02");
        assertEquals(allVideos[1].title, "Vidéo 02");
    } finally {
        getAllVideosStub.restore();
        getAuthProviderStub.restore();
    }
});
