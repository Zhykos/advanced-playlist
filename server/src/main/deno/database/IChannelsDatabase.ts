import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export interface IChannelsDatabase {
    getSubscribedChannels(): Promise<Channel[]>;
    hasSubscribedChannel(id: string): Promise<boolean>;
    subscribeToChannel(channel: Channel): Promise<Channel>;
}
