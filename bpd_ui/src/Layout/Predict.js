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
import {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	VerticalBarSeries,
	makeWidthFlexible,
	makeHeightFlexible,
	LineSeries,
	RadialChart,
	DiscreteColorLegend,
	ChartLabel
} from 'react-vis';

import "react-vis/dist/style.css"
import * as Constants from '../constants/constants.js';

const FlexibleXYPlot =  makeHeightFlexible(makeWidthFlexible(XYPlot));

export default class Dashboard extends React.Component {

    constructor()
    {
        super();
        this.state = {
            data: null,
            weapon: "Firearm"
        }

        this.updateData = this.updateData.bind(this);
    }

    componentWillMount()
    {
        this.updateData(this.state.weapon)
    }

    updateData(weapon)
    {
        var body = []

        var currentMonth = new Date().getMonth();

        for(var i = currentMonth+1; i <= currentMonth + 12; i++)
        {
            body.push(
                {
                    month: i % 12,
                    weapon: weapon.toUpperCase(),
                    year: 2020
                }
            )
        }

        fetch(
            Constants.API_URL + "/predict",
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
					'Content-Type': 'application/json'
				}
            }
        ).then(
            (response) => response.json()
        ).then(

            (json) => {console.log(json); this.setState({data: json})}
        )
    }
    render() {
        console.log("HI", this.state.data);
        return(    
            <div>
                <Row fluid style={{height: "13vh", margin: 0}}>
				    <Col style={{padding: 0}} md={2}>
					    <Header />
				    </Col>
				    <Col style={{padding: 0, backgroundColor: "black"}} md={7}>
				    </Col>
				    <Col style={{padding: 0, backgroundColor: "black"}} md={3}>
				    </Col>
		    	</Row>
                <Row style={{width: "100%", margin: 0, height: "7vh", backgroundColor: "white"}}>
                    <h1>Predictions for {this.state.weapon == "None" ? "Weaponless" : this.state.weapon} Crimes</h1>
                    <select style={{position: "absolute", top: "15vh", right: 20}} onChange={(e) => {this.setState({weapon: e.target.value}, this.updateData(e.target.value))}}>
                        <option value="Firearm">FIREARM</option>
                        <option value="Fire">FIRE</option>
                        <option value="Knife">KNIFE</option>
                        <option value="Hands">HANDS</option>
                        <option value="None">NONE</option>
                    </select>
                </Row>
			    <Row style={{margin: 0, width: "100%", height: "80vh", backgroundColor: "white"}}>
				    <FlexibleXYPlot xType="ordinal">
                        <VerticalGridLines />
			            <HorizontalGridLines />
			            <XAxis/>
			            <YAxis/>
                        <VerticalBarSeries colorType="literal" style={{strokeWidth: 0}} data={this.state.data ? this.state.data.map((e) => ({x: parseInt(e.month) + 1 + "/" + e.year, y: Math.max(0,e.count), color: "red"})) : []}/>
                    </FlexibleXYPlot>
                </Row>
            </div>)
    }
}