import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export interface IChannelsDatabase {
    getSubscribedChannels(): Promise<Array<Channel>>;
    subscribeToChannel(channel: Channel): Promise<Channel>;
}
