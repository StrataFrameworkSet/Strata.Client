import * as React from "react";
import {IHelloWorldPresenter} from "./IHelloWorldPresenter";
import {PresenterView} from "strata.client.react/Presenter";
import {IHelloWorldViewProperty} from "./IHelloWorldViewProperty";
import {IHelloWorldView} from "./IHelloWorldView";
import {Card} from "@blueprintjs/core";
import {InputGroup} from "@blueprintjs/core";
import {Button} from "@blueprintjs/core";
import {handleStringChange} from "@blueprintjs/docs-theme";
import {Label} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core";
import {IHelloWorldViewState} from "./IHelloWorldViewState";
import Element = React.JSX.Element;
import "./HelloWorldView.css";

export
class HelloWorldView
    extends
        PresenterView<
            IHelloWorldView,
            IHelloWorldPresenter,
            IHelloWorldViewProperty,
            IHelloWorldViewState>
    implements IHelloWorldView
{
    private handleNameChange = handleStringChange(name => this.setState({name:name}));
    private handleGreetingChange = handleStringChange(greeting => this.setState({greeting: greeting}));

    constructor(props: IHelloWorldViewProperty)
    {
        super(props);
        this.state = {
            name: "",
            greeting: "",
            personalizedGreeting: "Waiting for input..."
        };
    }

    render(): Element
    {
        return (
            <Card>
                <h1>Hello World View</h1>
                <form className="input-form">
                    <InputGroup
                        className="text-input"
                        disabled={false}
                        type="text"
                        leftIcon="person"
                        placeholder="Enter name..."
                        large={true}
                        value={this.state.name}
                        onChange={this.handleNameChange}/>
                    <InputGroup
                        className="text-input"
                        disabled={false}
                        type="text"
                        leftIcon="hand"
                        placeholder="Enter greeting..."
                        large={true}
                        value={this.state.greeting}
                        onChange={this.handleGreetingChange}/>
                    <Label className="greeting-label">{this.state.personalizedGreeting}</Label>
                    <Button
                        className="submit-button"
                        text="Submit"
                        intent={Intent.PRIMARY}
                        onClick={() =>this.props.presenter.submit()}/>
                </form>
            </Card>);
    }

    setPersonalizedGreeting(greeting: string): void
    {
        this.setState({personalizedGreeting: greeting});
    }

    getName(): string
    {
        return this.state.name;
    }

    getGreeting(): string
    {
        return this.state.greeting;
    }

    protected getSelf(): IHelloWorldView
    {
        return this;
    }
}