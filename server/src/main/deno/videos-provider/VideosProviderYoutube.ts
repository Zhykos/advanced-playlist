import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { IVideosProvider } from "./IVideosProvider.ts";
import { YouTube } from "./deps.ts";
import { YoutubeChannel } from "../models/youtube/YoutubeChannel.ts";

export class VideosProviderYoutube implements IVideosProvider {
    private youtubeApi: YouTube;

    constructor(apiKey: string) {
        this.youtubeApi = new YouTube(apiKey, false);
    }

    async getYoutubeChannel(name: string): Promise<YoutubeChannel> {
        return await this.youtubeApi
            .channels_list({
                part: "snippet",
                forUsername: name,
            });
    }

    async getChannel(name: string): Promise<Channel> {
        const youtubeChannelObj: YoutubeChannel = await this.getYoutubeChannel(
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
}
