import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from "./Header/Header.js";
import Map from "./Map/Map.js";
import Filter from './Filter/Filter.js';
import CrimeTable from "./CrimeTable/CrimeTable.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
		<Router>
			<div>
				<Header />
				<Route path="/home" component={Map}/>
				<Route path="/tables" component={CrimeTable}/>
			</div>
		</Router>
		<Filter/>
    </div>
  );
}

export default App;
