import {IHelloWorldModel} from "./IHelloWorldModel";

export
class HelloWorldModel
    implements IHelloWorldModel
{
    private name: string;
    private greeting: string;
    private personalizedGreeting: string;

    public constructor()
    {
        this.name = "";
        this.greeting = "";
        this.personalizedGreeting = this.greeting + ' ' + this.name;
    }

    setName(name: string): IHelloWorldModel
    {
        this.name = name;
        return this;
    }

    setGreeting(greeting: string): IHelloWorldModel
    {
        this.greeting = greeting;
        return this;
    }

    setPersonalizedGreeting(personalizedGreeting: string): IHelloWorldModel
    {
        this.personalizedGreeting = personalizedGreeting;
        return this;
    }

    getPersonalizedGreeting(): string
    {
        if (this.isNullOrEmpty(this.personalizedGreeting))
            return "Waiting for input...";

        return this.personalizedGreeting;
    }

    private isNullOrEmpty(value: string): boolean
    {
        return value == null || value == "";
    }
}