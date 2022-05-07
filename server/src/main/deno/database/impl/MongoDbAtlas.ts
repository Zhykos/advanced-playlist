import { MongoClient } from "./deps.ts";
import { MONGO_ATLAS_APP_ID, MONGO_ATLAS_DATA_API_KEY } from "../../config.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IProviderAuthDatabase } from "../models/IProviderAuthDatabase.ts";

export class MongoDbAtlas {
    private database;
    private authCollection;

    constructor() {
        const client = new MongoClient({
            appId: MONGO_ATLAS_APP_ID,
            dataSource: "maincluster",
            apiKey: MONGO_ATLAS_DATA_API_KEY,
        });
        this.database = client.database("advancedplaylist");
        this.authCollection = this.database.collection<IProviderAuthDatabase>(
            "auth",
        );
    }

    getVideosCollection() {
        return this.database.collection<Video>("videos");
    }

    findAuthProvider(provider: string): Promise<IProviderAuthDatabase> {
        return this.authCollection.findOne({ provider: provider });
    }

    getChannelsCollection() {
        return this.database.collection<Channel>("channels");
    }
}
