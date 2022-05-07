import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosDatabaseMongo } from "./database/impl/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "./videos-provider/impl/VideosProviderYoutube.ts";
import { VideosProviderYoutubeImpl } from "./videos-provider/impl/VideosProviderYoutubeImpl.ts";
import { SubscriptionsDatabaseMongo } from "./database/impl/SubscriptionsDatabaseMongo.ts";
import { AuthorizationsDatabaseMongo } from "./database/impl/AuthorizationsDatabaseMongo.ts";
import { DatabaseServiceAPI } from "./services-api/DatabaseServiceAPI.ts";
import { ProvidersServiceAPI } from "./services-api/ProvidersServiceAPI.ts";
import { YoutubeAuth } from "./database/models/impl/YoutubeAuth.ts";
import { MongoDbAtlas } from "./database/impl/MongoDbAtlas.ts";
import { YouTube } from "./videos-provider/impl/deps.ts";

// Specific implementations

const mongo = new MongoDbAtlas()
const videosDatabaseMongo = new VideosDatabaseMongo(mongo);
const subscriptionsDatabaseMongo = new SubscriptionsDatabaseMongo(mongo);
const authorizationsDatabaseMongo = new AuthorizationsDatabaseMongo(mongo);
const youtubeAuth: YoutubeAuth = await authorizationsDatabaseMongo
    .getYoutubeProviderAuth();
const youtubeApi: YouTube = youtubeAuth.createImpl();
const videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(youtubeApi);
const videosProviderYoutube = new VideosProviderYoutube(
    videosProviderYoutubeImpl,
);

// Services implementations

const databaseService: DatabaseServiceAPI = new DatabaseServiceAPI(
    videosDatabaseMongo,
);
const providersService: ProvidersServiceAPI = new ProvidersServiceAPI(
    subscriptionsDatabaseMongo,
    videosProviderYoutube,
);

// Server

new DenoOakServer(3000, databaseService, providersService).start();
