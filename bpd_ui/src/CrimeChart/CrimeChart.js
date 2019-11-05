import React from 'react';
import test_data from '../test_data/crimes.json';
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

import '../../node_modules/font-awesome/css/font-awesome.min.css'; 

import "react-vis/dist/style.css"
import {connect} from 'react-redux';
import "./CrimeChart.css";

import {aggregateRequest, aggregateResponse} from "../actions/aggregateRequest";
import * as Constants from '../constants/constants.js';

var _ = require("lodash");

const FlexibleXYPlot =  makeHeightFlexible(makeWidthFlexible(XYPlot));
const FlexibleRadialChart = makeHeightFlexible(makeWidthFlexible(RadialChart));

//Should probably moves these over to the constants folder
const DISTRICTS = ["NORTHERN", "NORTHEAST", "NORTHWEST", "SOUTHERN", "SOUTHEAST", "SOUTHWEST", "CENTRAL", "EASTERN", "WESTERN"];
const WEAPONS = ["FIREARM", "HANDS", "KNIFE", "FIRE", "OTHER"]

//Displays a grouping of visualizations based on the current crime data
class CrimeChart extends React.Component
{	
	constructor()
	{
		super();
		
		this.state = {
			chartData: [],			//The crime data, formatted for use in react-vis charts
			detailDisplay: null,	//What to show if a chart element is hovered over
			fullscreen: null,		//Which chart to display as fullscreen (bar, line, radial)
			groupBy: "District"
		}

		this.getChart = this.getChart.bind(this);
		this.getXYPlot = this.getXYPlot.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOverRadial = this.onMouseOverRadial.bind(this)
		this.updateGroupBy = this.updateGroupBy.bind(this);
		this.getMargin = this.getMargin.bind(this);
	}

	//Update the rendered data
	componentDidUpdate(prevProps)
	{
		//If stopped loading and was loading, reload the data
		if(!this.props.loading && prevProps.loading)
		{
			this.updateGroupBy({target: {value: this.state.groupBy}})
		}
	}
	
	//Render the visualizations
	render()
	{
		console.log("Props: ", this.props)
		//If crime data is empty
		if(!this.props.aggregate || !this.props.aggregate.length)
		{
			return <div style={{backgroundColor: "#BBB", display: "block", height: "100%"}}><br/>No Entries Available</div>
		}

		//If displaying a fullscreen chart
		if(this.state.fullscreen)
		{
			console.log("RERENDERING")
			return(
				<div style={{width: "100%", height: "100%"}}>
					{this.getXYPlot(this.state.fullscreen)}
					{this.state.detailDisplay ? <div className="chart-detail">{this.state.detailDisplay.x + ": " + this.state.detailDisplay.y}</div> : null}
				</div>
			)
		}

		//Normal display (4 blocks - chart options and 3 charts (bar, line, and radial))
		return(
			<div style={{height: "100%", width: "100%"}}>

			{/*CHART OPTIONS*/}
			<div style={{float: "right", height: "50%", width: "50%", backgroundColor: "white", marginBottom: "5px"}}>
				Chart Options
				<br/>
				Group by:
				<select value={this.state.groupBy} onChange={this.updateGroupBy}>
					<option>District</option>
					<option>Weapon</option>
					<option>Crimecode</option>
					<option>Month</option>
				</select>
			</div>

			{/*LINE CHART*/}
			<div style={{display: "inline-block", height: "50%", width: "50%"}}>
				{this.getXYPlot("line")}
			</div>

			{/*BAR CHART*/}
			<div style={{display: "inline-block", height: "50%", width: "50%", marginTop: "-5px"}}>
				{this.getXYPlot("bar")}
			</div>

			{/*RADIAL CHART*/}
			<div style={{display: "inline-block", height: "50%", width: "50%", marginTop: "-5px"}}>
				{this.getXYPlot("radial")}
			</div>

			{/*DETAIL DISPLAY*/}
{			this.state.detailDisplay ? <div className="chart-detail">{this.state.detailDisplay.x + ": " + this.state.detailDisplay.y}</div> : null}
			</div>
		);
	}

	dataToChart(data)
	{
		var chartData = []

		for(var i in data)
			if(data[i].field != "NA" && data[i].field != "UNKNOWN")
				chartData.push({x: data[i].field, y: data[i].count})

		chartData.sort((a,b) => {return a.y > b.y ? -1 : 1})
		console.log("CHART DATA: ", chartData
		)

		return chartData;
	}

	//Get the XYPlot (or chart in general) of the specified type
	getXYPlot(type)
	{

		//Radial is handled differently
		if(type == "radial")
			return this.getChart(type);

		console.log('REF: ', this._plot);

		//var x_translate = "translate(" + (this._plot ? (this._plot.state.width / 2 - 100) + ", " + (this._plot.state.height - 10) : "0,0") + ")"
		var x_translate = "translate(50%, 50%)";
		console.log("X_TRANSLATE: ", x_translate);

		//XY Plots (Bar and Line charts)
		return (
		<FlexibleXYPlot ref={(ref) => {this._plot=ref}} margin={{left: this.getMargin(), bottom: this.getMargin()}} onMouseLeave={() => {this.setState({detailDisplay: null})}} style={{backgroundColor: "#FFFFFF"}} xType="ordinal">
			<VerticalGridLines />
			<HorizontalGridLines />
			<XAxis tickLabelAngle={-40} style={{text: {fontSize: this.chartFontSize()}}}/>
			<YAxis/>
			{/*<ChartLabel style={{transform: "translate(15, 0) rotate(-90)"}} text="Count" className="alt-y-label" includeMargin={true}/>
			<ChartLabel text={this.state.groupBy} style={{transform: x_translate}}  includeMargin={true}/>*/}
			{this.getChart(type)}
			<i className="fa fa-expand fullscreen-icon" style={{position: "absolute", top: 5, right: 5, color: "black"}} onClick={() => this.setState({fullscreen: this.state.fullscreen == type ? null : type})} />
		</FlexibleXYPlot>
		);
	}


	getChart(type)
	{
		//Possible Radial chart colors
		var colors =[
			"#3366CC",
			"#DC3912",
			"#FF9900",
			"#109618",
			"#990099",
			"#3B3EAC",
			"#0099C6",
			"#DD4477",
			"#66AA00",
			"#B82E2E",
			"#316395",
			"#994499",
			"#22AA99",
			"#AAAA11",
			"#6633CC",
			"#E67300",
			"#8B0707",
			"#329262",
			"#5574A6",
			"#3B3EAC"
		];

		var radialLegend = [];
		
		//Prepare Radial Data
		var radialData = this.state.chartData.map( (entry, i) => {
		
			radialLegend.push(
			{
				title: entry.x,
				color: colors[i]
			});
					
			return {
				angle: entry.y,
				label: entry.x,
				color: colors[i % colors.length]
			};
		})

		switch(type)
		{
			case "line":
				return (<LineSeries  onSeriesMouseOut={this.onMouseOut} onNearestX={this.onMouseOver} data={this.state.chartData} stroke="rgb(57,106,177)"/>)
			case "bar":
				return (<VerticalBarSeries onValueMouseOut={this.onMouseOut} onValueMouseOver={this.onMouseOver} style={{strokeWidth: 0}} data={this.state.chartData} fill="#42A5F5"/>)
			case "radial":
				return (
					<div style={{backgroundColor: "#FFFFFF", width: "100%", height: "100%"}}>
					<FlexibleRadialChart onValueMouseOut={this.onMouseOut} onValueMouseOver={this.onMouseOverRadial} style={{backgroundColor: "#FFFFFF", strokeWidth: 0}} colorType={'literal'} stroke={"#000000"} data={radialData}>
						{this.state.fullscreen ? <DiscreteColorLegend height={"100%"} style={{position: "absolute", top: 0, left: 0, fontSize: this.chartFontSize()}} items={radialLegend}/> : null}
						<i className="fa fa-expand fullscreen-icon" style={{position: "absolute", top: 5, right: 5, color: "black"}} onClick={() => this.setState({fullscreen: this.state.fullscreen == type ? null : type})} />
					</FlexibleRadialChart>
					</div>)
			default:
				return (<div>No Chart to Show</div>)
		}
	}

	//The font size of chart labels
	chartFontSize()
	{

		if(this.state.groupBy == "Crimecode" && this.state.fullscreen)
			return 8
		else if(this.state.groupBy == "Crimecode" && !this.state.fullscreen)
			return 4
		else if(this.state.fullscreen)
			return 11
		else
			return 8
	}

	getMargin()
	{
		if(this.state.fullscreen)
			return 60;
		else
			return 50;
	}

	  //When an element is hovered over
	  onMouseOver(datapoint, event)
	  {
		  this.setState({
			  detailDisplay: datapoint,
		  })
	  }

	  onMouseOverRadial(datapoint, event)
	  {
		  var y;
		  var sum = 0;

		  for(var i in this.state.chartData){
			sum += this.state.chartData[i].y;
			if (this.state.chartData[i].x == datapoint.label)
				y = this.state.chartData[i].y
		  }

		  this.setState({
			  detailDisplay: {x: datapoint.label, y: y + " (" + (y/sum * 100).toFixed(2) + "%)"}
		  })
	  }

	  //When an element stops being hovered over
	  onMouseOut()
	  {
		  console.log("MOUSE OUT");
		  this.setState({
			  detailDisplay: null
		  })
	  }

	  updateGroupBy(e)
	  {
		var groupBy = e.target.value;
		this.props.aggregateRequest(groupBy);

		this.setState({groupBy: groupBy})

		var filtersToUse = this.props.filters;
		filtersToUse["group_by"] = groupBy.toLowerCase();

		var URL = Constants.API_URL + Constants.AGGREGATE;

			
		//Submit the form data
		fetch(
			URL,
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filtersToUse)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.props.aggregateResponse(response); this.setState({chartData: this.dataToChart(response)});}
		)
	  }

}

//Redux
//	Need crime data, filter options, and loading states
const mapStateToProps = (state) => {
	return {
		filters: state.crimeReducer.filters,
		loading: state.crimeReducer.loading,
		chartLoading: state.crimeReducer.chartLoading,
		aggregate: state.aggregateReducer.aggregate
	}
}

const mapDispatchToProps = dispatch => ({
	aggregateRequest: (groupBy) => dispatch(aggregateRequest(groupBy)),
	aggregateResponse: (aggregate) => dispatch(aggregateResponse(aggregate))
})

export default connect(mapStateToProps, mapDispatchToProps)(CrimeChart);