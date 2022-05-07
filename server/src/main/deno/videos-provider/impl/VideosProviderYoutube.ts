import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IVideosProvider } from "../IVideosProvider.ts";
import { IYoutubeChannel } from "../models/IYoutubeChannel.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { VideosProviderYoutubeImpl } from "./VideosProviderYoutubeImpl.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";

export class VideosProviderYoutube implements IVideosProvider {
    private youtubeApiImpl: VideosProviderYoutubeImpl;

    constructor(youtubeApiImpl: VideosProviderYoutubeImpl) {
        this.youtubeApiImpl = youtubeApiImpl;
    }

    async getChannel(name: string): Promise<Channel> {
        const youtubeChannelObj: IYoutubeChannel = await this.youtubeApiImpl
            .getChannel(
                name,
            );
        return new Promise((resolve, reject) => {
            const totalResults = youtubeChannelObj.pageInfo.totalResults;
            if (totalResults == 1) {
                const channel = new Channel();
                channel.id = youtubeChannelObj.items[0].id;
                channel.title = youtubeChannelObj.items[0].snippet.id;
                resolve(channel);
            } else {
                reject(
                    `Cannot get channel '${name}' because there is ${totalResults} search results.`,
                );
            }
        });
    }

    async getVideosFromChannel(channel: Channel): Promise<Array<Video>> {
        const youtubeVideos: Array<IYoutubeVideo> = await this.youtubeApiImpl
            .getVideosFromChannel(channel.id);
        const videos: Array<Video> = youtubeVideos.map((youtubeVideo) => {
            const video = new Video();
            video.id = youtubeVideo.id.videoId;
            video.title = youtubeVideo.snippet.title;
            return video;
        });
        return Promise.resolve(videos);
    }
}
