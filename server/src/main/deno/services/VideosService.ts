import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { VideosService as OpenApiVideosService } from "../../generated/deno-oak-server/services/VideosService.ts";
import { IVideosDatabase } from "../database/IVideosDatabase.ts";
import { Helpers } from "../../generated/deno-oak-server/controllers/Helpers.ts";
import { IVideosProvider } from "../videos-provider/IVideosProvider.ts";

export class VideosService implements OpenApiVideosService {
    private database: IVideosDatabase;
    private youtube: IVideosProvider;

    constructor(database: IVideosDatabase, youtube: IVideosProvider) {
        this.database = database;
        this.youtube = youtube;
    }

    fetchVideos(): Promise<void> {
        this.youtube.getChannel("zhykos");
        return Helpers.wrapPromise();
    }

    async getVideos(): Promise<Video[]> {
        return await this.database.getAllVideos();
    }
}
