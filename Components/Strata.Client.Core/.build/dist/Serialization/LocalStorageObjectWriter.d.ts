import { AbstractObjectWriter, ISerializable } from "strata.foundation.core/Serialization";
export declare class LocalStorageObjectWriter extends AbstractObjectWriter {
    private readonly storageKey;
    constructor(storageKey: string);
    write<T extends ISerializable>(value: T): LocalStorageObjectWriter;
    toLocalStorage(): LocalStorageObjectWriter;
}
