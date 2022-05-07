import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IVideosProvider } from "../IVideosProvider.ts";
import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { VideosProviderYoutubeImpl } from "./VideosProviderYoutubeImpl.ts";
import { IYoutubeVideo } from "../models/IYoutubeVideo.ts";

export class VideosProviderYoutube implements IVideosProvider {
    private youtubeApiImpl: VideosProviderYoutubeImpl;

    constructor(youtubeApiImpl: VideosProviderYoutubeImpl) {
        this.youtubeApiImpl = youtubeApiImpl;
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
