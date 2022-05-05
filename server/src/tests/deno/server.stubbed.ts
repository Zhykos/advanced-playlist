import { DatabaseServiceAPI } from "../../main/deno/services-api/DatabaseServiceAPI.ts";
import { ProvidersServiceAPI } from "../../main/deno/services-api/ProvidersServiceAPI.ts";
import { DenoOakServer } from "../../main/generated/deno-oak-server/DenoOakServer.ts";
import { TestsHelpers } from "./mocks/TestsHelpers.ts";

// Mock results

const testsHelpers: TestsHelpers = await TestsHelpers.createInstance();
testsHelpers.createStubs();

// Services implementations

const databaseService: DatabaseServiceAPI = testsHelpers.createDatabaseService()
const providersService: ProvidersServiceAPI = testsHelpers.createProvidersService()

// Server

const server = new DenoOakServer(3666, databaseService, providersService);
server.addEndRouteListener(() => {
    testsHelpers.resetStubs();
    testsHelpers.createStubs();
});
server.start();
