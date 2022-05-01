import { VideosService } from "../../main/deno/services/VideosService.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

// Mock results

const testsHelpers = await TestsHelpers.createInstance();
let stubForGettingAllVideosFromDatabase = testsHelpers
    .createStubForGettingAllVideosFromDatabase();
let stubForGettingChannelFromYoutube = testsHelpers
    .createStubForGettingChannelFromYoutube();
let stubForGettingYoutubeAuthProviderFromDatabase = testsHelpers
    .createStubForGettingYoutubeAuthProviderFromDatabase();

// Services implementations

const videoService = new VideosService(
    testsHelpers.getStubbedVideosDatabaseMongoDbAtlas(),
    testsHelpers.getStubbedVideosProviderYoutube(),
);

// Server

const server = new DenoOakServer(3666, videoService);
server.addEndRouteListener(() => {
    stubForGettingAllVideosFromDatabase.restore();
    stubForGettingChannelFromYoutube.restore();
    stubForGettingYoutubeAuthProviderFromDatabase.restore();

    stubForGettingAllVideosFromDatabase = testsHelpers
        .createStubForGettingAllVideosFromDatabase();
    stubForGettingChannelFromYoutube = testsHelpers
        .createStubForGettingChannelFromYoutube();
    stubForGettingYoutubeAuthProviderFromDatabase = testsHelpers
        .createStubForGettingYoutubeAuthProviderFromDatabase();
});
server.start();
