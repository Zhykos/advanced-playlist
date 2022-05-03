import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { IVideosDatabase } from "./IVideosDatabase.ts";
import { videosCollection } from "./MongoDbAtlas.ts";

export class VideosDatabaseMongo implements IVideosDatabase {
    getAllVideos(): Promise<Video[]> {
        return videosCollection.find();
    }
}
