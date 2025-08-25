import {AbstractObjectWriter, ISerializable} from "strata.foundation.core/Serialization";

export
class SessionStorageObjectWriter
    extends AbstractObjectWriter
{
    private readonly storageKey: string;

    public constructor(storageKey: string)
    {
        super();
        this.storageKey = storageKey;
    }

    write<T extends ISerializable>(value: T): SessionStorageObjectWriter
    {
        return super.write(value) as SessionStorageObjectWriter;
    }

    public toSessionStorage(): SessionStorageObjectWriter
    {
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.getRoot()));
        return this;
    }
}