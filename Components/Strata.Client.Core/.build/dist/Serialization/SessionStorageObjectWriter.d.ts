import { AbstractObjectWriter, ISerializable } from "strata.foundation.core/Serialization";
export declare class SessionStorageObjectWriter extends AbstractObjectWriter {
    private readonly storageKey;
    constructor(storageKey: string);
    write<T extends ISerializable>(value: T): SessionStorageObjectWriter;
    toSessionStorage(): SessionStorageObjectWriter;
}
