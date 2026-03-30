import { AbstractObjectReader } from "strata.foundation.core/Serialization";
export declare class SessionStorageObjectReader extends AbstractObjectReader {
    private source;
    constructor(storageKey: string);
    private static fromSessionStorage;
}
