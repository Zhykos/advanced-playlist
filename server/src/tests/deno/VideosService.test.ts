import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { VideosService } from "../../main/deno/services/VideosService.ts";
import { videosCollection } from "./mocks/FakeDatabase.ts";

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
const videosService: VideosService = testsHelpers.createVideosService();

Deno.test("Get all videos", async () => {
    const stub1 = testsHelpers
        .createStubForGettingAllVideosFromDatabase();
    const stub2 = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();

    try {
        const allVideos: Array<Video> = await videosService.getVideos();
        assertEquals(allVideos.length, 2);
        assertEquals(allVideos[0].id, "video_01");
        assertEquals(allVideos[0].title, "Video 01");
        assertEquals(allVideos[1].id, "video_02");
        assertEquals(allVideos[1].title, "Vidéo 02");
    } finally {
        stub1.restore();
        stub2.restore();
    }
});

// Deno.test("Fetch videos without duplicate", async () => {
//     const stub1 = testsHelpers
//         .createStubForGettingAllVideosFromDatabase();
//     const stub2 = testsHelpers
//         .createStubForGettingYoutubeAuthProviderFromDatabase();

//     try {
//         const beforeAllVideos: Array<Video> = await videosService.getVideos();
//         assertEquals(beforeAllVideos.length, 2);

//         const fetchVideos: Array<Video> = await videosService.fetchVideos();
//         assertEquals(fetchVideos.length, 2);
//         assertEquals(fetchVideos[0].id, "video_03");
//         assertEquals(fetchVideos[0].title, "Video 03");
//         assertEquals(fetchVideos[1].id, "video_04");
//         assertEquals(fetchVideos[1].title, "Vidéo 04");

//         const afterAllVideos: Array<Video> = await videosService.getVideos();
//         assertEquals(afterAllVideos.length, 4);
//     } finally {
//         stub1.restore();
//         stub2.restore();
//     }
// });

// Deno.test("Fetch videos with duplicate", async () => {
//     const stub1 = testsHelpers
//         .createStubForGettingAllVideosFromDatabase();
//     const stub2 = testsHelpers
//         .createStubForGettingYoutubeAuthProviderFromDatabase();

//     try {
//         const duplicatedVideo = new Video();
//         duplicatedVideo.id, "video_04";
//         duplicatedVideo.title, "Vidéo 04";
//         videosCollection.push(duplicatedVideo);

//         const beforeAllVideos: Array<Video> = await videosService.getVideos();
//         assertEquals(beforeAllVideos.length, 3);

//         const fetchVideos: Array<Video> = await videosService.fetchVideos();
//         assertEquals(fetchVideos.length, 1);
//         assertEquals(fetchVideos[0].id, "video_03");
//         assertEquals(fetchVideos[0].title, "Video 03");

//         const afterAllVideos: Array<Video> = await videosService.getVideos();
//         assertEquals(afterAllVideos.length, 4);
//     } finally {
//         stub1.restore();
//         stub2.restore();
//     }
// });
