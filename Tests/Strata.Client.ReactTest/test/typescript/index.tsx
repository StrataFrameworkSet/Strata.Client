/*
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

 */

import * as React from "react";
import {ReactApplication} from 'strata.client.react';
import {IHelloWorldModel} from "./Hello/IHelloWorldModel";
import {IHelloWorldView} from "./Hello/IHelloWorldView";
import {IHelloWorldPresenter} from "./Hello/IHelloWorldPresenter";
import {IApplication} from "strata.client.core";
import {HelloWorldApplication} from "./Main/HelloWorldApplication";
import './index.css';

let application: IApplication = new HelloWorldApplication();

application.start();
