import { assertEquals } from "./deps.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

const testsHelpers: TestsHelpers = new TestsHelpers();

Deno.test("Has subscribed to a channel", async () => {
    testsHelpers.createStubs();

    try {
        const subscribed: boolean = await testsHelpers.channelsDatabase
            .hasSubscribedChannel("channel-01");
        assertEquals(subscribed, false);
    } finally {
        testsHelpers.resetStubs();
    }
});
