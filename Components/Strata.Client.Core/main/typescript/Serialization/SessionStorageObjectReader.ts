import {
    AbstractObjectReader,
    SerializationException
} from "strata.foundation.core/Serialization";

export
class SessionStorageObjectReader
    extends AbstractObjectReader
{
    private source: string;

    public constructor(storageKey: string)
    {
        super(SessionStorageObjectReader.fromSessionStorage(storageKey));
    }

    private static fromSessionStorage(storageKey: string): any
    {
        const item: string = sessionStorage.getItem(storageKey);

        if (item === null)
        {
            console.log("LocalStorageObjectReader: No item found in local storage for key " + storageKey);
            return null;
        }

        return JSON.parse(item);
    }

}