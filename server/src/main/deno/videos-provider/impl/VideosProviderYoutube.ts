import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IVideosProvider } from "../IVideosProvider.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";
import { IYoutubeChannel } from "../models/IYoutubeChannel.ts";
import { YouTube } from "./deps.ts";

export class VideosProviderYoutube implements IVideosProvider {
    private youtubeApi: YouTube;

    constructor(youtubeApi: YouTube) {
        this.youtubeApi = youtubeApi;
    }

    async getVideosFromChannel(channel: Channel): Promise<Array<Video>> {
        try {
            const youtubeVideos: Array<IYoutubeVideo> = await this
                .getYoutubeVideosFromChannel(channel.id);
            const videos: Array<Video> = youtubeVideos.map((youtubeVideo) => {
                const video = new Video();
                video.id = youtubeVideo.id.videoId;
                video.title = youtubeVideo.snippet.title;
                return video;
            });
            return Promise.resolve(videos);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async getYoutubeVideosFromChannel(
        channelId: string,
    ): Promise<Array<IYoutubeVideo>> {
        const result: ISearchListResult = await this.youtubeApi.search_list({
            part: "snippet",
            channelId: channelId,
        });
        if (result.items) {
            return Promise.resolve(result.items);
        }
        return Promise.reject(result);
    }

    async getChannels(channelName: string): Promise<Array<Channel>> {
        const youtubeChannels: Array<IYoutubeChannel> = await this
            .getYoutubeChannels(channelName);
        const channels: Array<Channel> = youtubeChannels.map(
            (youtubeChannel) => {
                const channel = new Channel();
                channel.id = youtubeChannel.id;
                channel.title = youtubeChannel.snippet.title;
                return channel;
            },
        );
        return Promise.resolve(channels);
    }

    private async getYoutubeChannels(
        channelName: string,
    ): Promise<Array<IYoutubeChannel>> {
        const result: IChannelsListResult = await this.youtubeApi
            .channels_list({
                part: "snippet",
                forUsername: channelName,
            });
        if (result.items) {
            return Promise.resolve(result.items);
        }
        return Promise.reject(result);
    }
}

interface ISearchListResult {
    items?: Array<IYoutubeVideo>;
}

interface IChannelsListResult {
    items?: Array<IYoutubeChannel>;
}
