import { resolvesNext, stub } from "../deps.ts";
import { videosCollection as videosYoutubeCollection } from "./FakeYoutube.ts";
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

    private mongo_authCollection_findOne_stub: any;
    private mongo_videosCollection_find_stub: any;
    private mongo_channelsCollection_find_stub: any;
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
        this.mongo_authCollection_findOne_stub = stub(
            this.mongo.authCollection,
            "findOne",
            resolvesNext([{ data: ["api=foo"], provider: "" }]),
        );

        this.mongo_videosCollection_find_stub = stub(
            this.mongo.videosCollection,
            "find",
            resolvesNext([videosDatabaseCollection]),
        );

        this.mongo_channelsCollection_find_stub = stub(
            this.mongo.channelsCollection,
            "find",
            resolvesNext([channelsDatabaseCollection]),
        );

        this.youtubeApi_search_list_stub = stub(
            this.youtubeApi,
            "search_list",
            resolvesNext([{ items: videosYoutubeCollection }]),
        );
    }

    resetStubs(): void {
        this.mongo_authCollection_findOne_stub.restore();
        this.mongo_videosCollection_find_stub.restore();
        this.mongo_channelsCollection_find_stub.restore();
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
