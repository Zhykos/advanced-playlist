import { IVideosProvider } from "../../../main/deno/videos-provider/IVideosProvider.ts";
import { Channel } from "../../../main/generated/deno-oak-server/models/Channel.ts";
import { Helpers } from "../../../main/generated/deno-oak-server/controllers/Helpers.ts";

export class VideosProviderForTests implements IVideosProvider {
    getChannel(name: string): Promise<Channel> {
        const channel = new Channel();
        channel.id = "channel-01";
        channel.title = name;
        return Helpers.wrapPromise(channel);
    }
}
