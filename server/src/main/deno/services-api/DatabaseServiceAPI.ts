import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { DatabaseService as OpenApiDatabaseService } from "../../generated/deno-oak-server/services/DatabaseService.ts";
import { IChannelsDatabase } from "../database/IChannelsDatabase.ts";
import { IVideosDatabase } from "../database/IVideosDatabase.ts";

export class DatabaseServiceAPI implements OpenApiDatabaseService {
    private videosDatabase: IVideosDatabase;
    private channelsDatabase: IChannelsDatabase;

    constructor(
        videosDatabase: IVideosDatabase,
        channelsDatabase: IChannelsDatabase,
    ) {
        this.videosDatabase = videosDatabase;
        this.channelsDatabase = channelsDatabase;
    }

    async getVideosFromDatabase(): Promise<Video[]> {
        return await this.videosDatabase.getAllVideos();
    }

    async subscribeToChannel(channel: Channel): Promise<Channel> {
        return await this.channelsDatabase.subscribeToChannel(channel);
    }

    async saveVideos(videos: Video[]): Promise<Video[]> {
        return await this.videosDatabase.saveVideos(videos);
    }
}
