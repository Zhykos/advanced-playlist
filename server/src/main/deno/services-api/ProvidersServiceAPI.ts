import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { ProvidersService as OpenApiProvidersService } from "../../generated/deno-oak-server/services/ProvidersService.ts";
import { IVideosProvider } from "../videos-provider/IVideosProvider.ts";
import { IChannelsDatabase } from "../database/IChannelsDatabase.ts";
import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export class ProvidersServiceAPI implements OpenApiProvidersService {
    private channelsDatabase: IChannelsDatabase;
    private videosProvider: IVideosProvider;

    constructor(
        channelsDatabase: IChannelsDatabase,
        videosProvider: IVideosProvider,
    ) {
        this.channelsDatabase = channelsDatabase;
        this.videosProvider = videosProvider;
    }

    async getVideosFromSubscribedProviders(): Promise<Video[]> {
        const subChannels: Array<Channel> = await this.channelsDatabase
            .getSubscribedChannels();
        const promises: Promise<Video[]>[] = subChannels.map((channel) =>
            this.videosProvider.getVideosFromChannel(channel)
        );
        const fetchVideos: Video[][] = await Promise.all(promises);
        const result: Video[] = fetchVideos[0];
        if (result === undefined) {
            return Promise.resolve([]);
        }
        return Promise.resolve(result);
    }

    async searchChannelFromProviders(channelName: string): Promise<Channel[]> {
        const channels: Channel[] = await this.videosProvider.getChannels(
            channelName,
        );
        return Promise.resolve(channels);
    }
}
