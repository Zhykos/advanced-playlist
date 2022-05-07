import { resolvesNext, stub } from "../deps.ts";
import {
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
import { ProvidersServiceAPI } from "../../../main/deno/services-api/ProvidersServiceAPI.ts";
import { MongoDbAtlas } from "../../../main/deno/database/impl/MongoDbAtlas.ts";
import { YouTube } from "../../../main/deno/videos-provider/impl/deps.ts";

export class TestsHelpers {
    private videosDatabase: IVideosDatabase;
    private subsDatabase: ISubscriptionsDatabase;
    private mongo: MongoDbAtlas;
    private authDatabase: IAuthorizationsDatabase;
    private videosProviderYoutubeImpl: VideosProviderYoutubeImpl;
    private youtubeApi: YouTube;

    private mongo_findAuthProvider_stub: any;
    private mongo_getAllVideos_stub: any;
    private mongo_getSubscribedChannels_stub: any;
    private youtubeApi_search_list_stub: any;

    constructor() {
        this.mongo = new MongoDbAtlas();
        this.videosDatabase = new VideosDatabaseMongo(this.mongo);
        this.authDatabase = new AuthorizationsDatabaseMongo(this.mongo);
        this.subsDatabase = new SubscriptionsDatabaseMongo(this.mongo);
        this.youtubeApi = new YouTube("", false);
        this.videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(
            this.youtubeApi,
        );
    }

    createStubs(): void {
        this.mongo_findAuthProvider_stub = stub(
            this.mongo,
            "findAuthProvider",
            resolvesNext([{ data: ["api=foo"], provider: "" }]),
        );

        this.mongo_getAllVideos_stub = stub(
            this.mongo,
            "getAllVideos",
            resolvesNext([videosDatabaseCollection]),
        );

        this.mongo_getSubscribedChannels_stub = stub(
            this.mongo,
            "getSubscribedChannels",
            resolvesNext([channelsDatabaseCollection]),
        );

        this.youtubeApi_search_list_stub = stub(
            this.youtubeApi,
            "search_list",
            resolvesNext([{ items: videosYoutubeCollection }]),
        );
    }

    resetStubs(): void {
        this.mongo_findAuthProvider_stub.restore();
        this.mongo_getAllVideos_stub.restore();
        this.mongo_getSubscribedChannels_stub.restore();
        this.youtubeApi_search_list_stub.restore();
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
