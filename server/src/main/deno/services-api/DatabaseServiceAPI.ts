import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { DatabaseService as OpenApiDatabaseService } from "../../generated/deno-oak-server/services/DatabaseService.ts";
import { ISubscriptionsDatabase } from "../database/ISubscriptionsDatabase.ts";
import { IVideosDatabase } from "../database/IVideosDatabase.ts";

export class DatabaseServiceAPI implements OpenApiDatabaseService {
    private videosDatabase: IVideosDatabase;
    private subsDatabase: ISubscriptionsDatabase;

    constructor(
        videosDatabase: IVideosDatabase,
        subsDatabase: ISubscriptionsDatabase,
    ) {
        this.videosDatabase = videosDatabase;
        this.subsDatabase = subsDatabase;
    }

    async getVideosFromDatabase(): Promise<Video[]> {
        return await this.videosDatabase.getAllVideos();
    }

    async subscribeToChannel(channel: Channel): Promise<Channel> {
        return await this.subsDatabase.subscribeToChannel(channel);
    }
}
