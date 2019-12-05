import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Slider from '../Slider/Slider.js';
import Header from "../Header/Header.js";
import Map from "../Map/Map.js";
import Filter from '../Filter/Filter.js';
import CrimeTable from "../CrimeTable/CrimeTable.js";
import CrimeChart from '../CrimeChart/CrimeChart.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import Predict from './Predict.js';
import {loading} from "../actions/crimeRequest";

export default class Layout extends React.Component {

    render() {
        return(
        <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/predict" component={Predict}/>
				
				{/*<Col md={9} style={{padding: 0}}>
					<Route exact path="/map" component={Map}/>
					<Route path="/home" component={Dashboard}/>
					<Route path="/tables" component={CrimeTable}/>
					<Route path="/charts" component={CrimeChart}/>
				</Col>
				<Col md={3} style={{padding: 0}}>
					<Filter/>
				</Col>*/}
		</Container>);
    }
}