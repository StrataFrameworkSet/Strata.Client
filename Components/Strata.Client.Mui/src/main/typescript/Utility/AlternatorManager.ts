import {Alternator} from "./Alternator";
import {Alternate} from "./Alternate";

export
class AlternatorManager
{
    private alternator: Alternator;

    constructor()
    {
        this.alternator = null;
    }

    setAlternator(alternator: Alternator): AlternatorManager
    {
        console.log("AlternatorManager.setAlternator");
        this.alternator = alternator;
        return this;
    }

    registerAlternate(alternate: Alternate): AlternatorManager
    {
        console.log("AlternatorManager.registerAlternate");
        this.alternator.register(alternate);
        return this;
    }

    getAlternator(): Alternator { return this.alternator; }
}