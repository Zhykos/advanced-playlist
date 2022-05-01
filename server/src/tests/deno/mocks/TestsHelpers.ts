import { resolvesNext, stub } from "../deps.ts";
import { channelsCollection as channelsYoutubeCollection } from "./FakeYoutube.ts";
import { videosCollection } from "./FakeDatabase.ts";
import { VideosDatabaseMongoDbAtlas } from "../../../main/deno/database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "../../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { AuthYoutube } from "../../../main/deno/models/youtube/AuthYoutube.ts";

export class TestsHelpers {
    private videosDatabaseMongoDbAtlas: VideosDatabaseMongoDbAtlas;
    private videosProviderYoutube: VideosProviderYoutube;

    public static createInstance = async () => {
        const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();
        const videosProviderYoutube = await VideosProviderYoutube
            .createInstance(
                videosDatabaseMongoDbAtlas,
            );
        return new TestsHelpers(
            videosDatabaseMongoDbAtlas,
            videosProviderYoutube,
        );
    };

    private constructor(
        videosDatabaseMongoDbAtlas: VideosDatabaseMongoDbAtlas,
        videosProviderYoutube: VideosProviderYoutube,
    ) {
        this.videosDatabaseMongoDbAtlas = videosDatabaseMongoDbAtlas;
        this.videosProviderYoutube = videosProviderYoutube;
    }

    createStubForGettingChannelFromYoutube() {
        return stub(
            this.videosProviderYoutube,
            "getYoutubeChannel",
            resolvesNext(channelsYoutubeCollection),
        );
    }

    createStubForGettingYoutubeAuthProviderFromDatabase() {
        return stub(
            this.videosDatabaseMongoDbAtlas,
            "getAuthProvider",
            resolvesNext([new AuthYoutube("")]),
        );
    }

    createStubForGettingAllVideosFromDatabase() {
        return stub(
            this.videosDatabaseMongoDbAtlas,
            "getAllVideos",
            resolvesNext([videosCollection]),
        );
    }

    getStubbedVideosDatabaseMongoDbAtlas() {
        return this.videosDatabaseMongoDbAtlas;
    }

    getStubbedVideosProviderYoutube() {
        return this.videosProviderYoutube;
    }
}
