import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosDatabaseMongo } from "./database/impl/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "./videos-provider/impl/VideosProviderYoutube.ts";
import { ChannelsDatabaseMongo } from "./database/impl/ChannelsDatabaseMongo.ts";
import { AuthorizationsDatabaseMongo } from "./database/impl/AuthorizationsDatabaseMongo.ts";
import { DatabaseServiceAPI } from "./services-api/DatabaseServiceAPI.ts";
import { ProvidersServiceAPI } from "./services-api/ProvidersServiceAPI.ts";
import { YoutubeAuth } from "./database/models/impl/YoutubeAuth.ts";
import { MongoDbAtlas } from "./database/impl/MongoDbAtlas.ts";
import { YouTube } from "./videos-provider/impl/deps.ts";

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

new DenoOakServer(3000, databaseService, providersService).start();
