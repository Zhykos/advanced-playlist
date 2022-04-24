import { MongoClient } from "../deps.ts";
import { APP_ID, DATA_API_KEY } from "../config.ts";
import { Video } from "../../generated/deno-oak-server/models/Video.ts";

const client = new MongoClient({
    appId: APP_ID,
    dataSource: "maincluster",
    apiKey: DATA_API_KEY,
});
const database = client.database("advancedplaylist");
export const videosCollection = database.collection<Video>("videos");
