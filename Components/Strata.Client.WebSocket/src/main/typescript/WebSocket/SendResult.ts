export class SendResult<E>
{
    constructor(
        public readonly event?: E,
        public readonly error?: Error
    ) {}

    public isOK(): boolean
    {
        return this.error === undefined;
    }
}