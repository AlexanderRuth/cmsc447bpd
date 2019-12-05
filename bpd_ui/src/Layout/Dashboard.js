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

export default class Dashboard extends React.Component {

    render() {
        return(    
            <div>
                			<Row fluid style={{height: "13vh", margin: 0}}>
				<Col style={{padding: 0}} md={2}>
					<Header />
				</Col>
				<Col style={{padding: 0}} md={7}>
					<Slider />
				</Col>
				<Col style={{padding: 0}} md={3}>
					<Filter/>
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
            </div>)
    }
}