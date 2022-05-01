import { assertEquals, resolvesNext, stub } from "./deps.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { VideosDatabaseMongoDbAtlas } from "../../main/deno/database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { videosCollection } from "./mocks/FakeDatabase.ts";

// Specific implementations

const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();
const videosProviderYoutube = await VideosProviderYoutube.createInstance(
    videosDatabaseMongoDbAtlas,
);

// Service implementations

const videoService = new VideosService(
    videosDatabaseMongoDbAtlas,
    videosProviderYoutube,
);

// Tests

Deno.test("Get all videos", async () => {
    const getAllVideosStub = stub(
        videosDatabaseMongoDbAtlas,
        "getAllVideos",
        resolvesNext([videosCollection]),
    );
    try {
        const allVideos: Array<Video> = await videoService.getVideos();
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "video_01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "video_02");
        assertEquals(allVideos[1].title, "Vidéo 02");
    } finally {
        getAllVideosStub.restore();
    }
});
