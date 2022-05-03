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
