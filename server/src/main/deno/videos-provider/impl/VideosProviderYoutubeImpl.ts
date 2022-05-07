import { YouTube } from "./deps.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";

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
}

interface ISearchListResult {
    items: Array<IYoutubeVideo>;
}
