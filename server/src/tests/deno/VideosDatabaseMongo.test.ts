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
