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
	LineSeries
} from 'react-vis';

import "react-vis/dist/style.css"

const FlexibleXYPlot =  makeHeightFlexible(makeWidthFlexible(XYPlot));

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
	render()
	{
		return(
			<FlexibleXYPlot style={{backgroundColor: "#BBB"}} xType="ordinal">
			    <VerticalGridLines />
				<HorizontalGridLines />
				<XAxis/>
				<YAxis />
				<LineSeries data={data} stroke={"#FFF"}/>
			</FlexibleXYPlot>
		);
	}
}