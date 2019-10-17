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
			fullscreen: null		//Which chart to display as fullscreen (bar, line, radial)
		}

		this.getChart = this.getChart.bind(this);
		this.getXYPlot = this.getXYPlot.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	//Update the rendered data
	componentDidUpdate(prevProps)
	{
		//If stopped loading and was loading, reload the data
		if(!this.props.loading && prevProps.loading)
			this.setState({chartData: this.dataToChart()})
	}
	
	//Render the visualizations
	render()
	{

		//If crime data is empty
		if(!this.state.chartData.length)
		{
			return <div style={{backgroundColor: "#BBB", display: "block", height: "100%"}}><br/>No Entries Available</div>
		}

		//If displaying a fullscreen chart
		if(this.state.fullscreen)
		{
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
			<div style={{float: "left", height: "50%", width: "50%", backgroundColor: "gold"}}>
				Chart Options
				<br/>
				Group by:
				<select>
					<option>DISTRICT</option>
					<option>WEAPON</option>
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

	dataToChart()
	{
		var chartData = []

		//var dateRange = (end_day - start_day) / ONE_DAY;

		//Map each field to an index in the chartData array
		var mappings = this.getMappings("weapon");

		//Get the labels for the x axis
		chartData = this.getXAxisLabels(chartData, "weapon");

		//Count the data based on the domain
		chartData = this.mapData(chartData, mappings, "weapon");

		//for(var i = 0; i <= range; i++)
		//	data.push({x: getFormattedDate(new Date(start_day + ONE_DAY * i)), y: 0});

		return chartData;
	}

	//Get the XYPlot (or chart in general) of the specified type
	getXYPlot(type)
	{

		//Radial is handled differently
		if(type == "radial")
			return this.getChart(type);

		//XY Plots (Bar and Line charts)
		return (
		<FlexibleXYPlot style={{backgroundColor: "#BBB"}} xType="ordinal">
			<VerticalGridLines />
			<HorizontalGridLines />
			<XAxis style={{text: {fontSize: this.chartFontSize()}}}/>
			<YAxis />
			<ChartLabel title="Count" className="alt-x-label" includeMargin={false} xPercent={0.025} yPercent={1.01}/>
			{this.getChart(type)}
			<i className="fa fa-expand fullscreen-icon" style={{position: "absolute", top: 5, right: 5, color: "black"}} onClick={() => this.setState({fullscreen: this.state.fullscreen == type ? null : type})} />
		</FlexibleXYPlot>
		);
	}


	getChart(type)
	{
		//Possible Radial chart colors
		const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'teal', 'navy', 'maroon', 'lime']
		  
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
				color: colors[i]
			};
		})

		switch(type)
		{
			case "line":
				return (<LineSeries  onValueMouseOut={this.onMouseOut} onValueMouseOver={this.onMouseOver} data={this.state.chartData} stroke={"#981E32"}/>)
			case "bar":
				return (<VerticalBarSeries onValueMouseOut={this.onMouseOut} onValueMouseOver={this.onMouseOver} data={this.state.chartData} stroke={"#981E32"}/>)
			case "radial":
				return (
					<FlexibleRadialChart style={{backgroundColor: "#BBB"}} colorType={'literal'} stroke={"#981E32"} data={radialData}>
						{this.state.fullscreen ? <DiscreteColorLegend height={"100%"} style={{position: "absolute", top: 0, left: 0, fontSize: this.chartFontSize()}} items={radialLegend}/> : null}
						<i className="fa fa-expand fullscreen-icon" style={{position: "absolute", top: 5, right: 5, color: "black"}} onClick={() => this.setState({fullscreen: this.state.fullscreen == type ? null : type})} />
					</FlexibleRadialChart>)
			default:
				return (<div>No Chart to Show</div>)
		}
	}

	//The font size of chart labels
	chartFontSize()
	{
		if(this.state.fullscreen)
			return 10
		else
			return 5
	}
	//Take from mappings
	getXAxisLabels(data, group_by="district")
	{
		//Group by District
		if(group_by == "district")
			for(var i in DISTRICTS)
				data.push({x: DISTRICTS[i], y: 0});

		//Group by Weapon
		if(group_by == "weapon")
			for(var i in WEAPONS)
				data.push({x: WEAPONS[i], y: 0});
		
		//Date
		//getFormattedDate(new Date(start_day + ONE_DAY * i))

		return data;
	}

	//Map attribute to index
	getMappings(attr)
	{
		var mappings = {}
		switch(attr)
		{
			case "district":
				DISTRICTS.map((district, i) => mappings[district] = i)
			case "weapon":
				WEAPONS.map((weapon, i) => mappings[weapon] = i)
		}

		console.log("Mappings: ", mappings)
		return mappings;
	}

	//Count the data
	mapData(data, mappings, attr)
	{
		for(var i in this.props.data)
		{
			if(this.props.data[i][attr] && data[mappings[this.props.data[i][attr]]])
			{
				data[mappings[this.props.data[i][attr]]].y++;
			}
		}

		return data;
	}

	//Return a date formatted properly
	getFormattedDate(date) {
		var year = date.getFullYear();
	  
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
	  
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;

		var year = date.getYear().toString();
		
		return month + '/' + day + '/' + year.slice(1,3);
	  }

	  //When an element is hovered over
	  onMouseOver(datapoint, event)
	  {
		  this.setState({
			  detailDisplay: datapoint,
		  })
	  }

	  //When an element stops being hovered over
	  onMouseOut()
	  {
		  this.setState({
			  detailDisplay: null
		  })
	  }

}

//Redux
//	Need crime data, filter options, and loading states
const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes,
		filters: state.crimeReducer.filters,
		loading: state.crimeReducer.loading
	}
}

export default connect(mapStateToProps)(CrimeChart);