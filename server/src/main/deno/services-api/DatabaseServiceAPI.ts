import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { DatabaseService as OpenApiDatabaseService } from "../../generated/deno-oak-server/services/DatabaseService.ts";
import { IVideosDatabase } from "../database/IVideosDatabase.ts";

export class DatabaseServiceAPI implements OpenApiDatabaseService {
    private videosDatabase: IVideosDatabase;

    constructor(
        videosDatabase: IVideosDatabase,
    ) {
        this.videosDatabase = videosDatabase;
    }

    async getVideosFromDatabase(): Promise<Video[]> {
        return await this.videosDatabase.getAllVideos();
    }
}
