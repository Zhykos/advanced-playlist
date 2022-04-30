import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosService } from "./services/VideosService.ts";
import { VideosDatabaseMongoDbAtlas } from "./database/VideosDatabaseMongoDbAtlas.ts";
import { VideosProviderYoutube } from "./videos-provider/VideosProviderYoutube.ts";

// Specific implementations

const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();
const videosProviderYoutube = await VideosProviderYoutube.createInstance(
    videosDatabaseMongoDbAtlas,
);

// Service implementations

const videoService = new VideosService(
    videosDatabaseMongoDbAtlas,
    videosProviderYoutube,
);

// Server

new DenoOakServer(3000, videoService).start();
