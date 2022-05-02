import { YouTube } from "./deps.ts";
import { YoutubeChannel } from "../models/youtube/YoutubeChannel.ts";
import { IYoutubeVideo } from "../models/youtube/IYoutubeVideo.ts";

export class VideosProviderYoutubeImpl {
    private youtubeApi: YouTube;

    constructor(apiKey: string) {
        this.youtubeApi = new YouTube(apiKey, false);
    }

    getChannel(name: string): Promise<YoutubeChannel> {
        return this.youtubeApi
            .channels_list({
                part: "snippet",
                forUsername: name,
            });
    }

    getVideosFromChannel(channelId: string): Promise<Array<IYoutubeVideo>> {
        return this.youtubeApi.search_list({
            part: "snippet",
            channelId: channelId,
        });
    }

    // static async debug() {
    //     console.log(
    //         await new VideosProviderYoutubeImpl(
    //             "xxxxxxxxxxxxx",
    //         ).getVideosFromChannel("xxxxxxxxxxxx"),
    //     );
    // }
}

// deno run --allow-net src\main\deno\videos-provider\VideosProviderYoutubeImpl.ts
// VideosProviderYoutubeImpl.debug();
