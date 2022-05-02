import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosService } from "./services/VideosService.ts";
import { VideosDatabaseMongoDbAtlas } from "./database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "./videos-provider/VideosProviderYoutube.ts";
import { AuthYoutube } from "./models/youtube/AuthYoutube.ts";
import { VideosProviderYoutubeImpl } from "./videos-provider/VideosProviderYoutubeImpl.ts";
import { SubscriptionsDatabaseMongo } from "./database/SubscriptionsDatabaseMongo.ts";

// Specific implementations

const videosDatabaseMongo = new VideosDatabaseMongoDbAtlas();
const subscriptionsDatabaseMongo = new SubscriptionsDatabaseMongo();
const { api_key }: AuthYoutube = await videosDatabaseMongo
    .getAuthProvider({
        name: "youtube",
    });
const videosProviderYoutubeImpl = new VideosProviderYoutubeImpl(api_key);
const videosProviderYoutube = new VideosProviderYoutube(
    videosProviderYoutubeImpl,
);

// Services implementations

const videoService = new VideosService(
    videosDatabaseMongo,
    subscriptionsDatabaseMongo,
    videosProviderYoutube,
);

// Server

new DenoOakServer(3000, videoService).start();
