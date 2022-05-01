import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { AuthYoutube } from "../models/youtube/AuthYoutube.ts";

export interface IVideosDatabase {
    getAllVideos(): Promise<Array<Video>>;
    getAuthProvider(
        arg: ProviderArg & { name: "youtube" },
    ): Promise<AuthYoutube>;
}

export interface ProviderArg {
    name: "youtube";
}
