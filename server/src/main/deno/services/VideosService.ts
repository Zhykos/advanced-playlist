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
    private videosProvider: IVideosProvider;

    constructor(
        videosDatabase: IVideosDatabase,
        subsDatabase: ISubscriptionsDatabase,
        videosProvider: IVideosProvider,
    ) {
        this.videosDatabase = videosDatabase;
        this.subsDatabase = subsDatabase;
        this.videosProvider = videosProvider;
    }

    async fetchVideos(): Promise<Video[]> {
        const subChannels: Array<Channel> = await this.subsDatabase
            .getSubscribedChannels();
        const promises: Promise<Video[]>[] = subChannels.map((channel) =>
            this.videosProvider.getVideosFromChannel(channel)
        );
        const fetchVideos: Video[][] = await Promise.all(promises);
        return Helpers.wrapPromise(fetchVideos[0]);
    }

    async getVideos(): Promise<Video[]> {
        return await this.videosDatabase.getAllVideos();
    }
}
