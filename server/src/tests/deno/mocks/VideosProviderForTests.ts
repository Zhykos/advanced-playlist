import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";
import { Channel } from "../../../main/generated/deno-oak-server/models/Channel.ts";

export class VideosProviderForTests implements IVideosProvider {
    getChannel(name: string): Channel {
        throw new Error("Method not implemented.");
    }
}
