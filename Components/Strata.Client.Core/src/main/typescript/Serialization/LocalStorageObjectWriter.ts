import {AbstractObjectWriter, ISerializable} from "strata.foundation.core/Serialization";

export
class LocalStorageObjectWriter
    extends AbstractObjectWriter
{
    private readonly storageKey: string;

    public constructor(storageKey: string)
    {
        super();
        this.storageKey = storageKey;
    }

    write<T extends ISerializable>(value: T): LocalStorageObjectWriter
    {
        return super.write(value) as LocalStorageObjectWriter;
    }

    public toLocalStorage(): LocalStorageObjectWriter
    {
        localStorage.setItem(this.storageKey, JSON.stringify(this.getRoot()));
        return this;
    }
}