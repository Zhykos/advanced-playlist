import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosDatabaseMongo } from "./database/impl/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "./videos-provider/impl/VideosProviderYoutube.ts";
import { VideosProviderYoutubeImpl } from "./videos-provider/impl/VideosProviderYoutubeImpl.ts";
import { SubscriptionsDatabaseMongo } from "./database/impl/SubscriptionsDatabaseMongo.ts";
import { AuthorizationsDatabaseMongo } from "./database/impl/AuthorizationsDatabaseMongo.ts";
import { DatabaseServiceAPI } from "./services-api/DatabaseServiceAPI.ts";
import { ProvidersServiceAPI } from "./services-api/ProvidersServiceAPI.ts";
import { YoutubeAuth } from "./database/models/impl/YoutubeAuth.ts";

// Specific implementations

const videosDatabaseMongo = new VideosDatabaseMongo();
const subscriptionsDatabaseMongo = new SubscriptionsDatabaseMongo();
const authorizationsDatabaseMongo = new AuthorizationsDatabaseMongo();
const youtubeAuth: YoutubeAuth = await authorizationsDatabaseMongo
    .getYoutubeProviderAuth();
const videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(youtubeAuth);
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
