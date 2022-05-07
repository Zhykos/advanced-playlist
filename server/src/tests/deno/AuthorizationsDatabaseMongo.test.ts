import { YoutubeAuth } from "../../main/deno/database/models/impl/YoutubeAuth.ts";
import { YouTube } from "../../main/deno/videos-provider/impl/deps.ts";
import { assertEquals } from "./deps.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();

Deno.test("Get Youtube authorization", async () => {
    testsHelpers.createStubs();

    try {
        const auth: YoutubeAuth = await testsHelpers.getAuthDatabase()
            .getYoutubeProviderAuth();
        const youtube: YouTube = auth.connect();
        assertEquals(youtube.api_key, "foo");
    } finally {
        testsHelpers.resetStubs();
    }
});
