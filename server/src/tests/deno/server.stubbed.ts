import { VideosServiceAPI } from "../../main/deno/services-api/VideosServiceAPI.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

// Mock results

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
testsHelpers.createStubs();

// Services implementations

const videosService: VideosServiceAPI = testsHelpers.createVideosService();

// Server

const server = new DenoOakServer(3666, videosService);
server.addEndRouteListener(() => {
    testsHelpers.resetStubs();
    testsHelpers.createStubs();
});
server.start();
