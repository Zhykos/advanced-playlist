import { MongoClient } from "./deps.ts";
import { MONGO_ATLAS_APP_ID, MONGO_ATLAS_DATA_API_KEY } from "../../config.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IProviderAuthDatabase } from "../models/IProviderAuthDatabase.ts";

const client = new MongoClient({
    appId: MONGO_ATLAS_APP_ID,
    dataSource: "maincluster",
    apiKey: MONGO_ATLAS_DATA_API_KEY,
});

const database = client.database("advancedplaylist");

export const videosCollection = database.collection<Video>("videos");

export const authCollection = database.collection<IProviderAuthDatabase>(
    "auth",
);

export const channelsCollection = database.collection<Channel>("channels");
