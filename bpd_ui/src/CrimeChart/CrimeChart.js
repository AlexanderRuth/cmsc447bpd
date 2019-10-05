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
	DiscreteColorLegend
} from 'react-vis';

import "react-vis/dist/style.css"

const FlexibleXYPlot =  makeHeightFlexible(makeWidthFlexible(XYPlot));
const FlexibleRadialChart = makeHeightFlexible(makeWidthFlexible(RadialChart));

const start_day = new Date('September 5 2019').getTime();
const end_day = new Date('September 14 2019').getTime();

const ONE_DAY = 86400000; //ms in a day

const range = (end_day - start_day) / ONE_DAY;

var data = [];

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + '/' + day
}

for(var i = 0; i <= range; i++)
{
	data.push({x: getFormattedDate(new Date(start_day + ONE_DAY * i)), y: 0});
}

console.log(data);

test_data.map( (entry) => {
	console.log(Math.floor(new Date(entry.crimedate).getTime() - start_day) / ONE_DAY)
	data[Math.floor(new Date(entry.crimedate).getTime() - start_day) / ONE_DAY ].y++;
});

console.log(data);

export default class CrimeChart extends React.Component
{	
	constructor()
	{
		super();
		
		this.state = {
			chart_num: 0
		}
		this.getChart = this.getChart.bind(this);
		this.incChart = this.incChart.bind(this);
	}
	
	render()
	{
		if(this.state.chart_num == 2)
		{
			return this.getChart();
			
		}
		
		return(
			<FlexibleXYPlot style={{backgroundColor: "#BBB"}} xType="ordinal">
			    <VerticalGridLines />
				<HorizontalGridLines />
				<XAxis/>
				<YAxis />
				{this.getChart()}
				<button onClick={this.incChart} style={{position: "absolute", top: 0, right: 0}}>Click</button>
			</FlexibleXYPlot>
		);
	}
	
	incChart()
	{
		this.setState({
			chart_num: this.state.chart_num >= 2 ? 0 : this.state.chart_num+1
		});
	}
	getChart()
	{
		const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'teal', 'navy', 'maroon', 'lime']
		  
		var radialLegend = [];
		
		var radialData = data.map( (entry, i) => {
		
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
		
		console.log(radialData);
		
		switch(this.state.chart_num)
		{
			case 0:
				return (<LineSeries data={data} stroke={"#981E32"}/>)
			case 1:
				return (<VerticalBarSeries data={data} stroke={"#981E32"}/>)
			case 2:
		return (<FlexibleRadialChart style={{backgroundColor: "#BBB"}}colorType={'literal'} stroke={"#981E32"} data={radialData}><button onClick={this.incChart} style={{position: "absolute", top: 0, right: 0}}>Click</button><DiscreteColorLegend style={{position: "absolute", top: 0, left: 0, height: "100%"}} items={radialLegend}/></FlexibleRadialChart>)
			default:
				return (<LineSeries data={data} stroke={"#981E32"}/>)
		}
	}
}