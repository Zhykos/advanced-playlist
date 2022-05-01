import { assertEquals, resolvesNext, stub } from "./deps.ts";
import { VideosProviderYoutube } from "../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";
import { VideosDatabaseMongoDbAtlas } from "../../main/deno/database/VideosDatabaseMongoDbAtlas.ts";
import { channelsCollection as channelsYoutubeCollection } from "./mocks/FakeYoutube.ts";
import { AuthYoutube } from "../../main/deno/models/youtube/AuthYoutube.ts";

// Specific implementations

const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();
const videosProviderYoutube = await VideosProviderYoutube.createInstance(
    videosDatabaseMongoDbAtlas,
);

// Tests

Deno.test("Get zhykos' channel", async () => {
    const getYoutubeChannelStub = stub(
        videosProviderYoutube,
        "getYoutubeChannel",
        resolvesNext(channelsYoutubeCollection),
    );
    const getAuthProviderStub = stub(
        videosDatabaseMongoDbAtlas,
        "getAuthProvider",
        resolvesNext([new AuthYoutube("")]),
    );

    try {
        const channel: Channel = await videosProviderYoutube.getChannel(
            "zhykos",
        );
        assertEquals("channel", channel.id);
        assertEquals("Channel 01", channel.title);
    } finally {
        getYoutubeChannelStub.restore();
        getAuthProviderStub.restore();
    }
});
