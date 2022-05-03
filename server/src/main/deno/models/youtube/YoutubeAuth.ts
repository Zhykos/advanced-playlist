import { YouTube } from "../../videos-provider/deps.ts";
import { IProviderAuth } from "../IProviderAuth.ts";

export class YoutubeAuth implements IProviderAuth {
    api_key: string;

    constructor(api_key: string) {
        this.api_key = api_key;
    }

    connect(): YouTube {
        return new YouTube(this.api_key, false);
    }
}
