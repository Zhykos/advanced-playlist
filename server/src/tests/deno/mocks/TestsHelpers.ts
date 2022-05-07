import { resolvesNext, returnsNext, stub } from "../deps.ts";
import {
    channelsCollection as channelsYoutubeCollection,
    videosCollection as videosYoutubeCollection,
} from "./FakeYoutube.ts";
import {
    channelsCollection as channelsDatabaseCollection,
    videosCollection as videosDatabaseCollection,
} from "./FakeDatabase.ts";
import { VideosDatabaseMongo } from "../../../main/deno/database/impl/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "../../../main/deno/videos-provider/impl/VideosProviderYoutube.ts";
import { IVideosDatabase } from "../../../main/deno/database/IVideosDatabase.ts";
import { ISubscriptionsDatabase } from "../../../main/deno/database/ISubscriptionsDatabase.ts";
import { SubscriptionsDatabaseMongo } from "../../../main/deno/database/impl/SubscriptionsDatabaseMongo.ts";
import { DatabaseServiceAPI } from "../../../main/deno/services-api/DatabaseServiceAPI.ts";
import { VideosProviderYoutubeImpl } from "../../../main/deno/videos-provider/impl/VideosProviderYoutubeImpl.ts";
import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";
import { IAuthorizationsDatabase } from "../../../main/deno/database/IAuthorizationsDatabase.ts";
import { AuthorizationsDatabaseMongo } from "../../../main/deno/database/impl/AuthorizationsDatabaseMongo.ts";
import { YoutubeAuth } from "../../../main/deno/database/models/impl/YoutubeAuth.ts";
import { ProvidersServiceAPI } from "../../../main/deno/services-api/ProvidersServiceAPI.ts";
import { MongoDbAtlas } from "../../../main/deno/database/impl/MongoDbAtlas.ts";

export class TestsHelpers {
    private videosDatabase: IVideosDatabase;
    private subsDatabase: ISubscriptionsDatabase;
    private mongo: MongoDbAtlas;
    private authDatabase: IAuthorizationsDatabase;
    private videosProviderYoutubeImpl: VideosProviderYoutubeImpl;

    private videosProviderYoutubeImpl_getChannel_stub: any;
    private videosProviderYoutubeImpl_getVideosFromChannel_stub: any;
    private videosDatabase_getAuthProvider_stub: any;
    private videosDatabase_getAllVideos_stub: any;
    private subsDatabase_getSubscribedChannels_stub: any;
    private mongo_findAuthProvider_stub: any;

    // public static createInstance = async () => {
    //     return new TestsHelpers(
    //         new VideosDatabaseMongo(),
    //         new AuthorizationsDatabaseMongo(),
    //         new SubscriptionsDatabaseMongo(),
    //         new VideosProviderYoutubeImpl(new YoutubeAuth("")),
    //     );
    // };

    constructor() {
        this.mongo = new MongoDbAtlas();
        this.videosDatabase = new VideosDatabaseMongo(this.mongo);
        this.authDatabase = new AuthorizationsDatabaseMongo(this.mongo);
        this.subsDatabase = new SubscriptionsDatabaseMongo(this.mongo);
        this.videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(
            new YoutubeAuth(""),
        );
    }

    createStubs(): void {
        // this.videosProviderYoutubeImpl_getChannel_stub = stub(
        //     this.videosProviderYoutubeImpl,
        //     "getChannel",
        //     resolvesNext(channelsYoutubeCollection),
        // );
        // this.videosProviderYoutubeImpl_getVideosFromChannel_stub = stub(
        //     this.videosProviderYoutubeImpl,
        //     "getVideosFromChannel",
        //     resolvesNext([videosYoutubeCollection]),
        // );
        // this.videosDatabase_getAuthProvider_stub = stub(
        //     this.authDatabase,
        //     "getYoutubeProviderAuth",
        //     resolvesNext([new YoutubeAuth("")]),
        // );
        // this.videosDatabase_getAllVideos_stub = stub(
        //     this.videosDatabase,
        //     "getAllVideos",
        //     resolvesNext([videosDatabaseCollection]),
        // );
        // this.subsDatabase_getSubscribedChannels_stub = stub(
        //     this.subsDatabase,
        //     "getSubscribedChannels",
        //     resolvesNext([channelsDatabaseCollection]),
        // );

        this.mongo_findAuthProvider_stub = stub(
            this.mongo,
            "findAuthProvider",
            resolvesNext([{ data: ["api=foo"], provider: "" }]),
        );
        // this.getAuthCollection_findOne_stub = stub(
        //     this.mongo.getAuthCollection(),
        //     "findOne",
        //     resolvesNext([{ data: ["api=foo"], provider: "" }]),
        // );
    }

    resetStubs(): void {
        // this.videosProviderYoutubeImpl_getChannel_stub.restore();
        // this.videosProviderYoutubeImpl_getVideosFromChannel_stub.restore();
        // this.videosDatabase_getAuthProvider_stub.restore();
        // this.videosDatabase_getAllVideos_stub.restore();
        // this.subsDatabase_getSubscribedChannels_stub.restore();
        this.mongo_findAuthProvider_stub.restore();
    }

    createDatabaseService(): DatabaseServiceAPI {
        return new DatabaseServiceAPI(
            this.videosDatabase,
        );
    }

    createProvidersService(): ProvidersServiceAPI {
        return new ProvidersServiceAPI(
            this.subsDatabase,
            this.createVideosProvider(),
        );
    }

    createVideosProvider(): IVideosProvider {
        return new VideosProviderYoutube(
            this.videosProviderYoutubeImpl,
        );
    }

    getAuthDatabase(): IAuthorizationsDatabase {
        return this.authDatabase;
    }
}
