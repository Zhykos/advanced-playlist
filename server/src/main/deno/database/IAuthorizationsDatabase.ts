import { IProviderAuth } from "./models/IProviderAuth.ts";

export interface IAuthorizationsDatabase {
    getProviderAuth(): Promise<IProviderAuth>;
}
