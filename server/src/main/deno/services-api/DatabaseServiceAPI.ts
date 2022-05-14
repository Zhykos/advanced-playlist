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
        if (await this.channelsDatabase.hasSubscribedChannel(channel.id)) {
            return Promise.reject(
                new Deno.errors.AlreadyExists(
                    `Channel with ID '${channel.id}' already exists in the database.`,
                ),
            );
        }
        return await this.channelsDatabase.subscribeToChannel(channel);
    }

    async saveVideos(videosToSave: Video[]): Promise<Video[]> {
        const existingVideos: Video[] = await this.videosDatabase.getVideos(
            videosToSave.map((video) => video.id),
        );
        const existingIds: string[] = existingVideos.map((video) => video.id);
        return await this.videosDatabase.saveVideos(
            videosToSave.filter((video) => !existingIds.includes(video.id)),
        );
    }
}
