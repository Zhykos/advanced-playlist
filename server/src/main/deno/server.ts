import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosServiceAPI } from "./services-api/VideosServiceAPI.ts";
import { VideosDatabaseMongo } from "./database/impl/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "./videos-provider/impl/VideosProviderYoutube.ts";
import { VideosProviderYoutubeImpl } from "./videos-provider/impl/VideosProviderYoutubeImpl.ts";
import { SubscriptionsDatabaseMongo } from "./database/impl/SubscriptionsDatabaseMongo.ts";
import { AuthorizationsDatabaseMongo } from "./database/impl/AuthorizationsDatabaseMongo.ts";
import { YoutubeAuth } from "./database/models/impl/YoutubeAuth.ts";

// Specific implementations

const videosDatabaseMongo = new VideosDatabaseMongo();
const subscriptionsDatabaseMongo = new SubscriptionsDatabaseMongo();
const authorizationsDatabaseMongo = new AuthorizationsDatabaseMongo();
const youtubeAuth: YoutubeAuth = await authorizationsDatabaseMongo
    .getProviderAuth();
const videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(youtubeAuth);
const videosProviderYoutube = new VideosProviderYoutube(
    videosProviderYoutubeImpl,
);

// Services implementations

const videoService = new VideosServiceAPI(
    videosDatabaseMongo,
    subscriptionsDatabaseMongo,
    videosProviderYoutube,
);

// Server

new DenoOakServer(3000, videoService).start();
