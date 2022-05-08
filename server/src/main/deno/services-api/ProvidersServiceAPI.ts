import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { ProvidersService as OpenApiProvidersService } from "../../generated/deno-oak-server/services/ProvidersService.ts";
import { Helpers } from "../../generated/deno-oak-server/controllers/Helpers.ts";
import { IVideosProvider } from "../videos-provider/IVideosProvider.ts";
import { ISubscriptionsDatabase } from "../database/ISubscriptionsDatabase.ts";
import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export class ProvidersServiceAPI implements OpenApiProvidersService {
    private subsDatabase: ISubscriptionsDatabase;
    private videosProvider: IVideosProvider;

    constructor(
        subsDatabase: ISubscriptionsDatabase,
        videosProvider: IVideosProvider,
    ) {
        this.subsDatabase = subsDatabase;
        this.videosProvider = videosProvider;
    }

    async getVideosFromProviders(): Promise<Video[]> {
        const subChannels: Array<Channel> = await this.subsDatabase
            .getSubscribedChannels();
        const promises: Promise<Video[]>[] = subChannels.map((channel) =>
            this.videosProvider.getVideosFromChannel(channel)
        );
        const fetchVideos: Video[][] = await Promise.all(promises);
        return Helpers.wrapPromise(fetchVideos[0]);
    }

    async searchChannelFromProviders(channelName: string): Promise<Channel[]> {
        const channels: Channel[] = await this.videosProvider.getChannels(
            channelName,
        );
        return Promise.resolve(channels);
    }
}
