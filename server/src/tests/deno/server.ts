import { VideosService } from "../../main/deno/services/VideosService.ts";
import { VideosDatabaseForTests } from "./database/VideosDatabaseForTests.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";

const videosDatabaseForTests = new VideosDatabaseForTests();

const videoService = new VideosService(videosDatabaseForTests);

new DenoOakServer(3000, videoService).start();
