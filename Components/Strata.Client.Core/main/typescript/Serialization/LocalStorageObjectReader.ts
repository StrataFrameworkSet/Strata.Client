import {
    AbstractObjectReader,
    SerializationException
} from "strata.foundation.core/Serialization";

export
class LocalStorageObjectReader
    extends AbstractObjectReader
{
    private source: string;

    public constructor(storageKey: string)
    {
        super(LocalStorageObjectReader.fromLocalStorage(storageKey));
    }

    private static fromLocalStorage(storageKey: string): any
    {
        const item: string = localStorage.getItem(storageKey);

        if (item === null)
            throw new SerializationException(
                `No item found in localStorage for key: ${storageKey}`);

        return JSON.parse(item);
    }

}