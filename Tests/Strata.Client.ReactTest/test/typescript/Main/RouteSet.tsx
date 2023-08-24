import * as React from 'react';
import {Switch} from 'react-router';
import {Route,Redirect} from 'react-router-dom';
import {Component} from 'react';
import {HomeView} from '../Home/HomeView';
import {HelloWorldView} from "../Hello/HelloWorldView";
import {IRouteSetProperty} from "./IRouteSetProperty";
import {IHelloWorldView} from "../Hello/IHelloWorldView";
import {HelpView} from "../Help/HelpView";
import {IHelloWorldPresenter} from "../Hello/IHelloWorldPresenter";

export
class RouteSet
    extends Component<IRouteSetProperty,any>
{
    constructor(prop: IRouteSetProperty)
    {
        super(prop);
    }

    render()
    {
        let p: IHelloWorldPresenter =
            this
                .props
                .helloWorldPresenter;

        return (
            <Switch>
                <Route exact path="/home" component={HomeView}/>
                <Route exact path="/hello" render={() => <HelloWorldView presenter={p}/>}/>
                <Route exact path="/help" component={HelpView}/>
                <Redirect to="/home" push={true}/>
            </Switch>);
    }
}
