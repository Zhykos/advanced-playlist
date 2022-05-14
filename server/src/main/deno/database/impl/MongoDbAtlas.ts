import { MongoClient } from "./deps.ts";
import {
    MONGO_ATLAS_APP_ID,
    MONGO_ATLAS_DATA_API_KEY,
    MONGO_ATLAS_DATABASE,
} from "../../config.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IProviderAuthDatabase } from "../models/IProviderAuthDatabase.ts";

export class MongoDbAtlas {
    authCollection;
    videosCollection;
    channelsCollection;

    constructor() {
        const client = new MongoClient({
            appId: MONGO_ATLAS_APP_ID,
            dataSource: "maincluster",
            apiKey: MONGO_ATLAS_DATA_API_KEY,
        });
        const database = client.database(MONGO_ATLAS_DATABASE);
        this.authCollection = database.collection<IProviderAuthDatabase>(
            "auth",
        );
        this.videosCollection = database.collection<Video>("videos");
        this.channelsCollection = database.collection<Channel>("channels");
    }
}
