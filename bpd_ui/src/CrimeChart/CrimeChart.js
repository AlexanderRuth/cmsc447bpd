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
		var colors =[
			"#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
			"#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
			"#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
			"#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
			"#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
			"#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
			"#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
			"#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
			"#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
			"#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
			"#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
			"#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
			"#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
			"#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
			"#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
			"#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
			"#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
			"#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
			"#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
			"#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
			"#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
			"#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
			"#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
			"#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
			"#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
			"#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
			"#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
			"#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
			"#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
			"#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
			"#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
			"#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
			"#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
			"#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
			"#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
			"#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
			"#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
			"#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
			"#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
			"#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"]

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
					<div style={{backgroundColor: "#BBB", width: "100%", height: "100%"}}>
					<FlexibleRadialChart onValueMouseOut={this.onMouseOut} onValueMouseOver={this.onMouseOverRadial} style={{backgroundColor: "#BBB"}} colorType={'literal'} stroke={"#000000"} data={radialData}>
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
			return 5
		else if(this.state.groupBy == "Crimecode" && !this.state.fullscreen)
			return 3
		else if(this.state.fullscreen)
			return 10
		else
			return 5
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

		var URL = Constants.API_URL + Constants.AGGREGATE + "?" + Object.keys(filtersToUse).map(
			(param) => {
				return param + "=" + filtersToUse[param];
			}).join("&");

			
		//Submit the form data
		fetch(
			URL,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
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