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


const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
		<Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
		<Router>
			<Row fluid style={{height: "13vh", margin: 0}}>
				<Col style={{padding: 0}}>
					<Header />
				</Col>
			</Row>
			
			<Row style={{margin: 0}}>
				
				<Col md={6} style={{padding: 0, height: "50vh"}}>
					<Map/>
				</Col>
				<Col md={6} style={{padding: 0, height: "50vh"}}>
					<CrimeChart/>
				</Col>
				
			</Row>
			<Row style={{margin: 0}}>
				<Col md={12} style={{padding: 0}}>
					<CrimeTable />
				</Col>
				
			</Row>
				
				{/*<Col md={9} style={{padding: 0}}>
					<Route exact path="/map" component={Map}/>
					<Route path="/home" component={Dashboard}/>
					<Route path="/tables" component={CrimeTable}/>
					<Route path="/charts" component={CrimeChart}/>
				</Col>
				<Col md={3} style={{padding: 0}}>
					<Filter/>
				</Col>*/}
			
		</Router>
		</Container>
    </div>
  );
}

export default App;
