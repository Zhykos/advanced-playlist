import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { IVideosDatabase } from "../IVideosDatabase.ts";
import { MongoDbAtlas } from "./MongoDbAtlas.ts";

export class VideosDatabaseMongo implements IVideosDatabase {
    private mongo: MongoDbAtlas;

    constructor(mongo: MongoDbAtlas) {
        this.mongo = mongo;
    }

    getAllVideos(): Promise<Video[]> {
        return this.mongo.videosCollection.find();
    }
}
