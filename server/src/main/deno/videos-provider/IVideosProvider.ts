import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";

export interface IVideosProvider {
    getChannel(name: string): Channel;
}
