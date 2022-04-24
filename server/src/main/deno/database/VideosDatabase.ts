import { Video } from "../../generated/deno-oak-server/models/Video.ts";

export interface VideosDatabase {
    getAllVideos(): Promise<Array<Video>>;
}
