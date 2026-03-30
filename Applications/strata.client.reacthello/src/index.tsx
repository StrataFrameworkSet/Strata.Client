import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {IApplication} from 'strata.client.core/Main';
import {HelloWorldApplication} from "strata.client.reacttest/Main/HelloWorldApplication";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const application: IApplication = new HelloWorldApplication();

application.start();

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
