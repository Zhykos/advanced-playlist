import { AuthorizationsDatabaseMongo } from "../../main/deno/database/impl/AuthorizationsDatabaseMongo.ts";
import { ChannelsDatabaseMongo } from "../../main/deno/database/impl/ChannelsDatabaseMongo.ts";
import { MongoDbAtlas } from "../../main/deno/database/impl/MongoDbAtlas.ts";
import { VideosDatabaseMongo } from "../../main/deno/database/impl/VideosDatabaseMongo.ts";
import { YoutubeAuth } from "../../main/deno/database/models/impl/YoutubeAuth.ts";
import { DatabaseServiceAPI } from "../../main/deno/services-api/DatabaseServiceAPI.ts";
import { ProvidersServiceAPI } from "../../main/deno/services-api/ProvidersServiceAPI.ts";
import { YouTube } from "../../main/deno/videos-provider/impl/deps.ts";
import { VideosProviderYoutube } from "../../main/deno/videos-provider/impl/VideosProviderYoutube.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";
import type {
    Router,
    RouterContext,
} from "../../main/generated/deno-oak-server/deps-oak.ts";

// Specific implementations

const mongo = new MongoDbAtlas();
const videosDatabaseMongo = new VideosDatabaseMongo(mongo);
const channelsDatabaseMongo = new ChannelsDatabaseMongo(mongo);
const authorizationsDatabaseMongo = new AuthorizationsDatabaseMongo(mongo);
const youtubeAuth: YoutubeAuth = await authorizationsDatabaseMongo
    .getYoutubeProviderAuth();
const youtubeApi: YouTube = youtubeAuth.createImpl();
const videosProviderYoutube = new VideosProviderYoutube(
    youtubeApi,
);

// Services implementations

const databaseService: DatabaseServiceAPI = new DatabaseServiceAPI(
    videosDatabaseMongo,
    channelsDatabaseMongo,
);
const providersService: ProvidersServiceAPI = new ProvidersServiceAPI(
    channelsDatabaseMongo,
    videosProviderYoutube,
);

// Server

const server = new DenoOakServer(3555, databaseService, providersService);
server.execOnMiddleware((_middleware, router: Router) => {
    router.post("/dev/database/reset", (context) => resetDatabase(context));
});
server.start();

async function resetDatabase(context: any): Promise<void> {
    try {
        const deletedChannels: { deletedCount: number } = await mongo
            .channelsCollection.deleteMany({});
        const deletedVideos: { deletedCount: number } = await mongo
            .videosCollection.deleteMany({});
        const remainingChannels: number = await mongo.channelsCollection
            .countDocuments();
        const remainingVideos: number = await mongo.videosCollection
            .countDocuments();

        context.response.status = 200;
        context.response.body = {
            deletedChannels: deletedChannels.deletedCount,
            deletedVideos: deletedVideos.deletedCount,
            remainingChannels: remainingChannels,
            remainingVideos: remainingVideos,
        };
    } catch (e) {
        context.response.status = 500;
        context.response.body = { error: e.message };
    }
}
