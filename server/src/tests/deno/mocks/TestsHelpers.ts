import { resolvesNext, stub } from "../deps.ts";
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
import { IChannelsDatabase } from "../../../main/deno/database/IChannelsDatabase.ts";
import { ChannelsDatabaseMongo } from "../../../main/deno/database/impl/ChannelsDatabaseMongo.ts";
import { DatabaseServiceAPI } from "../../../main/deno/services-api/DatabaseServiceAPI.ts";
import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";
import { IAuthorizationsDatabase } from "../../../main/deno/database/IAuthorizationsDatabase.ts";
import { AuthorizationsDatabaseMongo } from "../../../main/deno/database/impl/AuthorizationsDatabaseMongo.ts";
import { ProvidersServiceAPI } from "../../../main/deno/services-api/ProvidersServiceAPI.ts";
import { MongoDbAtlas } from "../../../main/deno/database/impl/MongoDbAtlas.ts";
import { YouTube } from "../../../main/deno/videos-provider/impl/deps.ts";

export class TestsHelpers {
    private videosDatabase: IVideosDatabase;
    private channelsDatabase: IChannelsDatabase;
    private mongo: MongoDbAtlas;
    private authDatabase: IAuthorizationsDatabase;
    private youtubeApi: YouTube;
    private stubs = new Array();

    constructor() {
        this.mongo = new MongoDbAtlas();
        this.videosDatabase = new VideosDatabaseMongo(this.mongo);
        this.authDatabase = new AuthorizationsDatabaseMongo(this.mongo);
        this.channelsDatabase = new ChannelsDatabaseMongo(this.mongo);
        this.youtubeApi = new YouTube("", false);
    }

    createStubs(): void {
        this.createStubToResolvesNext(
            this.mongo.authCollection,
            "findOne",
            { data: ["api=foo"], provider: "" },
        );

        this.createStubToResolvesNext(
            this.mongo.videosCollection,
            "find",
            videosDatabaseCollection,
        );

        this.createStubToResolvesNext(
            this.mongo.videosCollection,
            "insertMany",
            { insertedIds: ["foo01", "foo02"] },
        );

        this.createStubToResolvesNext(
            this.mongo.channelsCollection,
            "find",
            channelsDatabaseCollection,
        );

        this.createStubToResolvesNext(
            this.mongo.channelsCollection,
            "insertOne",
            { insertedId: "foo" },
        );

        this.createStubToResolvesNext(
            this.youtubeApi,
            "search_list",
            { items: videosYoutubeCollection },
        );

        this.createStubToResolvesNext(
            this.youtubeApi,
            "channels_list",
            { items: channelsYoutubeCollection },
        );
    }

    private createStubToResolvesNext(
        objToStub: any,
        methodToStub: string,
        resolve: any,
    ) {
        const newStub = stub(
            objToStub,
            methodToStub,
            resolvesNext([resolve]),
        );
        this.stubs.push(newStub);
    }

    resetStubs(): void {
        this.stubs.forEach((stubToRestore) => stubToRestore.restore());
        this.stubs.length = 0;
    }

    createDatabaseService(): DatabaseServiceAPI {
        return new DatabaseServiceAPI(
            this.videosDatabase,
            this.channelsDatabase,
        );
    }

    createProvidersService(): ProvidersServiceAPI {
        return new ProvidersServiceAPI(
            this.channelsDatabase,
            this.createVideosProvider(),
        );
    }

    createVideosProvider(): IVideosProvider {
        return new VideosProviderYoutube(
            this.youtubeApi,
        );
    }

    getAuthDatabase(): IAuthorizationsDatabase {
        return this.authDatabase;
    }

    getYoutubeAPI(): YouTube {
        return this.youtubeApi;
    }
}
