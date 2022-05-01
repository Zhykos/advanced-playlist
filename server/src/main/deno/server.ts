import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosService } from "./services/VideosService.ts";
import { VideosDatabaseMongoDbAtlas } from "./database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "./videos-provider/VideosProviderYoutube.ts";
import { AuthYoutube } from "./models/youtube/AuthYoutube.ts";

// Specific implementations

const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();
const { api_key }: AuthYoutube = await videosDatabaseMongoDbAtlas
    .getAuthProvider({
        name: "youtube",
    });
const videosProviderYoutube = new VideosProviderYoutube(api_key);

// Services implementations

const videoService = new VideosService(
    videosDatabaseMongoDbAtlas,
    videosProviderYoutube,
);

// Server

new DenoOakServer(3000, videoService).start();
