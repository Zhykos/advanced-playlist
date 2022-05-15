import { Video } from "../../generated/deno-oak-server/models/Video.ts";

export interface IVideosDatabase {
    getAllVideos(): Promise<Video[]>;
    getVideos(ids: string[]): Promise<Video[]>;
    saveVideos(videos: Video[]): Promise<Video[]>;
}
