import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosServiceAPI } from "./services-api/VideosServiceAPI.ts";
import { VideosDatabaseMongo } from "./database/VideosDatabaseMongo.ts";
import { VideosProviderYoutube } from "./videos-provider/VideosProviderYoutube.ts";
import { YoutubeAuth } from "./models/youtube/YoutubeAuth.ts";
import { VideosProviderYoutubeImpl } from "./videos-provider/VideosProviderYoutubeImpl.ts";
import { SubscriptionsDatabaseMongo } from "./database/SubscriptionsDatabaseMongo.ts";
import { AuthorizationsDatabaseMongo } from "./database/AuthorizationsDatabaseMongo.ts";

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
