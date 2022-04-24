import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { VideosService as OpenApiVideosService } from "../../generated/deno-oak-server/services/VideosService.ts";
import { VideosDatabase } from "../database/VideosDatabase.ts";

export class VideosService implements OpenApiVideosService {
    private database: VideosDatabase;

    constructor(database: VideosDatabase) {
        this.database = database;
    }

    async getVideos(): Promise<Video[]> {
        return await this.database.getAllVideos();
    }
}
