import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from "./Header/Header.js";
import Map from "./Map/Map.js";
import Filter from './Filter/Filter.js';
import CrimeTable from "./CrimeTable/CrimeTable.js";
import CrimeChart from './CrimeChart/CrimeChart.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Slider from './Slider/Slider.js';
import Layout from './Layout/Layout.js';


const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
		<Layout />
    </div>
  );
}

export default App;
