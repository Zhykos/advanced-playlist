import { DenoOakServer } from "../generated/deno-oak-server/DenoOakServer.ts";
import { VideosService } from "./services/VideosService.ts";

const videoService = new VideosService();

new DenoOakServer(3000, videoService).start();
