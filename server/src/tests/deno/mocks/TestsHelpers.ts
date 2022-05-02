import { resolvesNext, stub } from "../deps.ts";
import {
    channelsCollection as channelsYoutubeCollection,
    videosCollection as videosYoutubeCollection,
} from "./FakeYoutube.ts";
import { videosCollection } from "./FakeDatabase.ts";
import { VideosDatabaseMongoDbAtlas } from "../../../main/deno/database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "../../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { AuthYoutube } from "../../../main/deno/models/youtube/AuthYoutube.ts";
import { IVideosDatabase } from "../../../main/deno/database/IVideosDatabase.ts";
import { ISubscriptionsDatabase } from "../../../main/deno/database/ISubscriptionsDatabase.ts";
import { SubscriptionsDatabaseMongo } from "../../../main/deno/database/SubscriptionsDatabaseMongo.ts";
import { VideosService } from "../../../main/deno/services/VideosService.ts";
import { VideosProviderYoutubeImpl } from "../../../main/deno/videos-provider/VideosProviderYoutubeImpl.ts";
import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";

export class TestsHelpers {
    private videosDatabase: IVideosDatabase;
    private subDatabase: ISubscriptionsDatabase;
    private videosProviderYoutubeImpl: VideosProviderYoutubeImpl;

    public static createInstance = async () => {
        return new TestsHelpers(
            new VideosDatabaseMongoDbAtlas(),
            new SubscriptionsDatabaseMongo(),
            new VideosProviderYoutubeImpl(""),
        );
    };

    private constructor(
        videosDatabase: IVideosDatabase,
        subDatabase: ISubscriptionsDatabase,
        videosProviderYoutubeImpl: VideosProviderYoutubeImpl,
    ) {
        this.videosDatabase = videosDatabase;
        this.subDatabase = subDatabase;
        this.videosProviderYoutubeImpl = videosProviderYoutubeImpl;
    }

    createStubForGettingChannelFromYoutube() {
        return stub(
            this.videosProviderYoutubeImpl,
            "getChannel",
            resolvesNext(channelsYoutubeCollection),
        );
    }

    createStubForGettingVideosFromChannelFromYoutube() {
        return stub(
            this.videosProviderYoutubeImpl,
            "getVideosFromChannel",
            resolvesNext([videosYoutubeCollection]),
        );
    }

    createStubForGettingYoutubeAuthProviderFromDatabase() {
        return stub(
            this.videosDatabase,
            "getAuthProvider",
            resolvesNext([new AuthYoutube("")]),
        );
    }

    createStubForGettingAllVideosFromDatabase() {
        return stub(
            this.videosDatabase,
            "getAllVideos",
            resolvesNext([videosCollection]),
        );
    }

    // createStubForFetchingVideosFromDatabase() {
    //     return stub(
    //         this.videosDatabase,
    //         "fetchVideos",
    //         resolvesNext([videosCollection]),
    //     );
    // }

    createVideosService(): VideosService {
        return new VideosService(
            this.videosDatabase,
            this.subDatabase,
            this.createVideosProvider(),
        );
    }

    createVideosProvider(): IVideosProvider {
        return new VideosProviderYoutube(
            this.videosProviderYoutubeImpl,
        );
    }
}
