import { Video } from "../../generated/deno-oak-server/models/Video.ts";

export interface IVideosDatabase {
    getAllVideos(): Promise<Array<Video>>;
    getVideos(ids: Array<string>): Promise<Array<Video>>;
    saveVideos(videos: Array<Video>): Promise<Array<Video>>;
}
