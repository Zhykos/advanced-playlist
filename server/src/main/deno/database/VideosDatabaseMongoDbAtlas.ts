import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { VideosDatabase } from "./VideosDatabase.ts";
import { videosCollection } from "./MongoDbAtlas.ts";

export class VideosDatabaseMongoDbAtlas implements VideosDatabase {
    getAllVideos(): Promise<Video[]> {
        return videosCollection.find();
    }
}
