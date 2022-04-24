import { assertEquals } from "./deps.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { VideosDatabaseForTests } from "./database/VideosDatabaseForTests.ts";

const videosDatabaseForTests = new VideosDatabaseForTests();

const service = new VideosService(videosDatabaseForTests);

Deno.test("Get all videos", async () => {
    const allVideos: Array<Video> = await service.getVideos();
    assertEquals(allVideos.length, 2);
});
