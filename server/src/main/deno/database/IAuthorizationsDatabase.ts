import { YoutubeAuth } from "./models/impl/YoutubeAuth.ts";

export interface IAuthorizationsDatabase {
    getYoutubeProviderAuth(): Promise<YoutubeAuth>;
}
