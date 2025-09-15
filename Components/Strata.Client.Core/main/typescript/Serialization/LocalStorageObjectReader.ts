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
        {
            console.log("LocalStorageObjectReader: No item found in local storage for key " + storageKey);
            return null;
        }

        return JSON.parse(item);
    }

}