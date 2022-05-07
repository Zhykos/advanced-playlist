import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { Video } from "../../generated/deno-oak-server/models/Video.ts";

export interface IVideosProvider {
    getVideosFromChannel(channel: Channel): Promise<Array<Video>>;
}
