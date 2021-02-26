import * as THREE from '../build/three.module.js';

import Stats from './jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/dat.gui.module.js';

import { Curves } from './jsm/curves/CurveExtras.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
