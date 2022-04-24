import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosService } from "./services/VideosService.ts";
import { VideosDatabaseMongoDbAtlas } from "./database/VideosDatabaseMongoDbAtlas.ts";

// Database implementations

const videosDatabaseMongoDbAtlas = new VideosDatabaseMongoDbAtlas();

// Service implementations

const videoService = new VideosService(videosDatabaseMongoDbAtlas);

// Server

new DenoOakServer(3000, videoService).start();
