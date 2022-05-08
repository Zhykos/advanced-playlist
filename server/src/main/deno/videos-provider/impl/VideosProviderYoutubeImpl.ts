import { YouTube } from "./deps.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";
import { IYoutubeChannel } from "../models/IYoutubeChannel.ts";

export class VideosProviderYoutubeImpl {
    private youtubeApi: YouTube;

    constructor(youtubeApi: YouTube) {
        this.youtubeApi = youtubeApi;
    }

    async getVideosFromChannel(
        channelId: string,
    ): Promise<Array<IYoutubeVideo>> {
        const videos: ISearchListResult = await this.youtubeApi.search_list({
            part: "snippet",
            channelId: channelId,
        });
        return Promise.resolve(videos.items);
    }

    async getChannels(
        channelName: string,
    ): Promise<Array<IYoutubeChannel>> {
        const channels: IChannelsListResult = await this.youtubeApi
            .channels_list({
                part: "snippet",
                forUsername: channelName,
            });
        return Promise.resolve(channels.items);
    }
}

interface ISearchListResult {
    items: Array<IYoutubeVideo>;
}

interface IChannelsListResult {
    items: Array<IYoutubeChannel>;
}
