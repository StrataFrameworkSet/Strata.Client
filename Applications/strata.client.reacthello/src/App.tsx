import React from 'react';
import logo from './logo.svg';
import './App.css';
import {IApplication} from 'strata.client.core/Main'
import {HelloWorldApplication} from "strata.client.reacttest/Main/HelloWorldApplication";

function App() {
  const application: IApplication = new HelloWorldApplication();
  application.start();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
