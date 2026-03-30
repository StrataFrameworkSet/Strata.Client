import { AbstractObjectReader } from "strata.foundation.core/Serialization";
export declare class LocalStorageObjectReader extends AbstractObjectReader {
    private source;
    constructor(storageKey: string);
    private static fromLocalStorage;
}
