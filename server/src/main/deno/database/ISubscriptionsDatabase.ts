import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export interface ISubscriptionsDatabase {
    getSubscribedChannels(): Promise<Array<Channel>>;
    subscribeToChannel(channel: Channel): Promise<Channel>;
}
