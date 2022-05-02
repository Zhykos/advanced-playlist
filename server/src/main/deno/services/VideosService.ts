import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { VideosService as OpenApiVideosService } from "../../generated/deno-oak-server/services/VideosService.ts";
import { IVideosDatabase } from "../database/IVideosDatabase.ts";
import { Helpers } from "../../generated/deno-oak-server/controllers/Helpers.ts";
import { IVideosProvider } from "../videos-provider/IVideosProvider.ts";
import { ISubscriptionsDatabase } from "../database/ISubscriptionsDatabase.ts";
import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export class VideosService implements OpenApiVideosService {
    private videosDatabase: IVideosDatabase;
    private subsDatabase: ISubscriptionsDatabase;
    private youtube: IVideosProvider;

    constructor(
        videosDatabase: IVideosDatabase,
        subsDatabase: ISubscriptionsDatabase,
        youtube: IVideosProvider,
    ) {
        this.videosDatabase = videosDatabase;
        this.subsDatabase = subsDatabase;
        this.youtube = youtube;
    }

    async fetchVideos(): Promise<Video[]> {
        const subChannels: Array<Channel> = await this.subsDatabase
            .getSubscribedChannels();
        subChannels.flatMap((channel) =>
            this.youtube.getVideosFromChannel(channel)
        );
        return Helpers.wrapPromise();
    }

    async getVideos(): Promise<Video[]> {
        return await this.videosDatabase.getAllVideos();
    }
}
