import { IVideosDatabase } from "../database/IVideosDatabase.ts";
import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { IVideosProvider } from "./IVideosProvider.ts";
import { YouTube } from "./deps.ts";
import { AuthYoutube } from "../models/AuthYoutube.ts";

export class VideosProviderYoutube implements IVideosProvider {
    private youtubeApi: YouTube;

    public static createInstance = async (database: IVideosDatabase) => {
        const { api_key }: AuthYoutube = await database.getAuthProvider({
            name: "youtube",
        });
        const youtubeApi = new YouTube(api_key, false);
        return new VideosProviderYoutube(youtubeApi);
    };

    private constructor(youtubeApi: YouTube) {
        this.youtubeApi = youtubeApi;
    }

    getChannel(name: string): Channel {
        this.youtubeApi.channels_list({ part: "snippet", forUsername: name })
            .then(function (response: any) {
                console.log(response);
            });

        throw new Error("Method not implemented.");
    }
}
