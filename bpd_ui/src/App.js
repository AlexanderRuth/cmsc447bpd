import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from "./Header/Header.js";
import Map from "./Map/Map.js";

function App() {
  return (
    <div className="App">
		<Header/>
		{/*Router*/}
		<Map/>
    </div>
  );
}

export default App;
