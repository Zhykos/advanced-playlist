import { resolvesNext, stub } from "../deps.ts";
import {
    channelsCollection as channelsYoutubeCollection,
    videosCollection as videosYoutubeCollection,
} from "./FakeYoutube.ts";
import {
    channelsCollection as channelsDatabaseCollection,
    videosCollection as videosDatabaseCollection,
} from "./FakeDatabase.ts";
import { VideosDatabaseMongo } from "../../../main/deno/database/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "../../../main/deno/videos-provider/VideosProviderYoutube.ts";
import { YoutubeAuth } from "../../../main/deno/models/youtube/YoutubeAuth.ts";
import { IVideosDatabase } from "../../../main/deno/database/IVideosDatabase.ts";
import { ISubscriptionsDatabase } from "../../../main/deno/database/ISubscriptionsDatabase.ts";
import { SubscriptionsDatabaseMongo } from "../../../main/deno/database/SubscriptionsDatabaseMongo.ts";
import { VideosServiceAPI } from "../../../main/deno/services-api/VideosServiceAPI.ts";
import { VideosProviderYoutubeImpl } from "../../../main/deno/videos-provider/VideosProviderYoutubeImpl.ts";
import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";
import { IAuthorizationsDatabase } from "../../../main/deno/database/IAuthorizationsDatabase.ts";
import { AuthorizationsDatabaseMongo } from "../../../main/deno/database/AuthorizationsDatabaseMongo.ts";

export class TestsHelpers {
    private videosDatabase: IVideosDatabase;
    private subDatabase: ISubscriptionsDatabase;
    private authDatabase: IAuthorizationsDatabase;
    private videosProviderYoutubeImpl: VideosProviderYoutubeImpl;

    private videosProviderYoutubeImpl_getChannel_stub: any;
    private videosProviderYoutubeImpl_getVideosFromChannel_stub: any;
    private videosDatabase_getAuthProvider_stub: any;
    private videosDatabase_getAllVideos_stub: any;
    private subDatabase_getSubscribedChannels_stub: any;

    public static createInstance = async () => {
        return new TestsHelpers(
            new VideosDatabaseMongo(),
            new AuthorizationsDatabaseMongo(),
            new SubscriptionsDatabaseMongo(),
            new VideosProviderYoutubeImpl(new YoutubeAuth("")),
        );
    };

    private constructor(
        videosDatabase: IVideosDatabase,
        authDatabase: IAuthorizationsDatabase,
        subDatabase: ISubscriptionsDatabase,
        videosProviderYoutubeImpl: VideosProviderYoutubeImpl,
    ) {
        this.videosDatabase = videosDatabase;
        this.authDatabase = authDatabase;
        this.subDatabase = subDatabase;
        this.videosProviderYoutubeImpl = videosProviderYoutubeImpl;
    }

    createStubs(): void {
        this.videosProviderYoutubeImpl_getChannel_stub = stub(
            this.videosProviderYoutubeImpl,
            "getChannel",
            resolvesNext(channelsYoutubeCollection),
        );
        this.videosProviderYoutubeImpl_getVideosFromChannel_stub = stub(
            this.videosProviderYoutubeImpl,
            "getVideosFromChannel",
            resolvesNext([videosYoutubeCollection]),
        );
        this.videosDatabase_getAuthProvider_stub = stub(
            this.authDatabase,
            "getProviderAuth",
            resolvesNext([new YoutubeAuth("")]),
        );
        this.videosDatabase_getAllVideos_stub = stub(
            this.videosDatabase,
            "getAllVideos",
            resolvesNext([videosDatabaseCollection]),
        );
        this.subDatabase_getSubscribedChannels_stub = stub(
            this.subDatabase,
            "getSubscribedChannels",
            resolvesNext([channelsDatabaseCollection]),
        );
    }

    resetStubs(): void {
        this.videosProviderYoutubeImpl_getChannel_stub.restore();
        this.videosProviderYoutubeImpl_getVideosFromChannel_stub.restore();
        this.videosDatabase_getAuthProvider_stub.restore();
        this.videosDatabase_getAllVideos_stub.restore();
        this.subDatabase_getSubscribedChannels_stub.restore();
    }

    createVideosService(): VideosServiceAPI {
        return new VideosServiceAPI(
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
