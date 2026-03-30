export
interface IHelloWorldModel
{
    setName(name: string): IHelloWorldModel;

    setGreeting(greeting: string): IHelloWorldModel;

    setPersonalizedGreeting(personalizedGreeting: string): IHelloWorldModel;

    getPersonalizedGreeting(): string;
}