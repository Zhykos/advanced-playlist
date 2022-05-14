import { assertEquals } from "./deps.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";
import { IVideosDatabase } from "../../main/deno/database/IVideosDatabase.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();
const videosDatabase: IVideosDatabase = testsHelpers.getVideosDatabase();

Deno.test("Save zero video", async () => {
    testsHelpers.createStubs();

    try {
        const videos: Array<Video> = await videosDatabase.saveVideos([]);
        assertEquals(videos.length, 0);
    } finally {
        testsHelpers.resetStubs();
    }
});

Deno.test("Get videos with ID", async () => {
    testsHelpers.createStubs();

    try {
        const videos: Array<Video> = await videosDatabase.getVideos([
            "video-01",
        ]);
        assertEquals(videos.length, 2);
        assertEquals(videos[0].id, "database-video-01");
        assertEquals(videos[1].id, "database-video-02");
    } finally {
        testsHelpers.resetStubs();
    }
});
