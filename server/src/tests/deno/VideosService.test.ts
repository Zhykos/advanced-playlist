import { assertEquals } from "./deps.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { VideosDatabaseForTests } from "./mocks/VideosDatabaseForTests.ts";
import { VideosProviderForTests } from "./mocks/VideosProviderForTests.ts";

const videosDatabaseForTests = new VideosDatabaseForTests();
const videosProviderForTests = new VideosProviderForTests();

const service = new VideosService(
    videosDatabaseForTests,
    videosProviderForTests,
);

Deno.test("Get all videos", async () => {
    const allVideos: Array<Video> = await service.getVideos();
    assertEquals(allVideos.length, 2);
});
