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
        const youtubeVideos: Array<IYoutubeVideo> = await this
            .getYoutubeVideosFromChannel(channel.id);
        const videos: Array<Video> = youtubeVideos.map((youtubeVideo) => {
            const video = new Video();
            video.id = youtubeVideo.id.videoId;
            video.title = youtubeVideo.snippet.title;
            return video;
        });
        return Promise.resolve(videos);
    }

    private async getYoutubeVideosFromChannel(
        channelId: string,
    ): Promise<Array<IYoutubeVideo>> {
        const videos: ISearchListResult = await this.youtubeApi.search_list({
            part: "snippet",
            channelId: channelId,
        });
        return Promise.resolve(videos.items);
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
