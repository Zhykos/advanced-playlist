import { VideosDatabase } from "../../../main/deno/database/VideosDatabase.ts";
import { Video } from "../../../main/generated/deno-oak-server/models/Video.ts";
import { videosCollection } from "./FakeDatabase.ts";
import { Helpers } from "../../../main/generated/deno-oak-server/controllers/Helpers.ts";

export class VideosDatabaseForTests implements VideosDatabase {
    async getAllVideos(): Promise<Video[]> {
        return Helpers.wrapPromise(videosCollection);
    }
}
