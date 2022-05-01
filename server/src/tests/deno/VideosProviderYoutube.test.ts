import { assertEquals } from "./deps.ts";
import { VideosProviderYoutube } from "../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { VideosDatabaseForTests } from "./mocks/VideosDatabaseForTests.ts";

const videosDatabaseForTests = new VideosDatabaseForTests();

const provider = await VideosProviderYoutube.createInstance(
    videosDatabaseForTests,
);

Deno.test("Get zhykos' channel", async () => {
    const channel: Channel = await provider.getChannel("zhykos");
    assertEquals("channel-01", channel.id);
    assertEquals("zhykos", channel.title);
});
