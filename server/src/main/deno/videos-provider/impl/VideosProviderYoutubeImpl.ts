import { YouTube } from "./deps.ts";
import { IYoutubeChannel } from "../models/IYoutubeChannel.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";
import { YoutubeAuth } from "../../database/models/impl/YoutubeAuth.ts";

export class VideosProviderYoutubeImpl {
    private youtubeApi: YouTube;

    constructor(youtubeAuth: YoutubeAuth) {
        this.youtubeApi = youtubeAuth.connect();
    }

    getChannel(name: string): Promise<IYoutubeChannel> {
        return this.youtubeApi
            .channels_list({
                part: "snippet",
                forUsername: name,
            });
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
}

interface ISearchListResult {
    items: Array<IYoutubeVideo>;
}
