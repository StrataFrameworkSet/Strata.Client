import {IRenderable} from 'strata.client.react';

export
interface IHelloWorldView
    extends IRenderable
{
    setPersonalizedGreeting(greeting: string): void;

    getName(): string;

    getGreeting(): string;
}