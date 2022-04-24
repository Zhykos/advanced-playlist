import { assertEquals } from "./deps.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";

const service = new VideosService();

Deno.test("Get all videos", async () => {
    const allVideos: Array<Video> = await service.getVideos();
    assertEquals(allVideos.length, 2);
});
