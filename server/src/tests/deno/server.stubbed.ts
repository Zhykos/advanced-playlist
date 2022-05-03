import { VideosService } from "../../main/deno/services/VideosService.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

// Mock results

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
testsHelpers.createStubs();

// Services implementations

const videoService: VideosService = testsHelpers.createVideosService();

// Server

const server = new DenoOakServer(3666, videoService);
server.addEndRouteListener(() => {
    testsHelpers.resetStubs();
    testsHelpers.createStubs();
});
server.start();
