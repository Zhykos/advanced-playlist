import { assertEquals } from "./deps.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

const testsHelpers = await TestsHelpers.createInstance();

Deno.test("Get zhykos' channel", async () => {
    const getYoutubeChannelStub = testsHelpers
        .createStubForGettingChannelFromYoutube();
    const getAuthProviderStub = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();

    try {
        const channel: Channel = await testsHelpers
            .getStubbedVideosProviderYoutube().getChannel(
                "zhykos",
            );
        assertEquals("channel", channel.id);
        assertEquals("Channel 01", channel.title);
    } finally {
        getYoutubeChannelStub.restore();
        getAuthProviderStub.restore();
    }
});
