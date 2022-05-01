import { IAuth } from "../IAuth.ts";

export class AuthYoutube implements IAuth {
    provider: string;
    api_key: string;

    constructor(api_key: string) {
        this.provider = "youtube";
        this.api_key = api_key;
    }
}
