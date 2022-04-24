import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { VideosService as OpenApiVideosService } from "../../generated/deno-oak-server/services/VideosService.ts";
import { MongoClient } from "../deps.ts";
import { APP_ID, DATA_API_KEY } from "../config.ts";

export class VideosService implements OpenApiVideosService {
    private videosCollection;

    constructor() {
        const client = new MongoClient({
            appId: APP_ID,
            dataSource: "maincluster",
            apiKey: DATA_API_KEY,
        });
        const database = client.database("advancedplaylist");
        this.videosCollection = database.collection<Video>("videos");
    }

    async getVideos(): Promise<Video[]> {
        return await this.videosCollection.find();
    }
}
