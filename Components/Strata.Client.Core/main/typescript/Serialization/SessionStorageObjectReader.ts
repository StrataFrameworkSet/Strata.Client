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
            throw new SerializationException(
                `No item found in sessionStorage for key: ${storageKey}`);

        return JSON.parse(item);
    }

}