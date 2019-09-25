import React from 'react';
import Filter from "../Filter/Filter.js";
import "./CrimeTable.css";
import test_data from '../test_data/crimes.json';

const headers = Object.keys(test_data[0]);
const PAGE_COUNT = 10;

export default class CrimeTable extends React.Component
{	
	constructor()
	{
		super();
		
		this.state = {
			page: 1
		}
	}
	render()
	{
		var rows = [];
		
		for(var i = PAGE_COUNT*(this.state.page-1); i < PAGE_COUNT*(this.state.page); i++)
		{
			var row = [];
			if(test_data[i])
			{				
				for(var j = 0; j < headers.length; j++)
				{
					row.push(test_data[i][headers[j]] ? test_data[i][headers[j]] : "n/a");
				}
			rows.push(row);
			}
		}
		return(
		<div>
			<div className="taskbar">
				<button onClick={() => {this.setState({page: this.state.page-=1})}}>Prev</button>
				<button onClick={() => {this.setState({page: this.state.page+=1})}}>Next</button>
				<br/>
				Page: {this.state.page}
			</div>
			<table>
			<tr>
			{headers.map( (row) => <th>{row}</th>)}
			</tr>
			{rows.map( (row) => <tr>{row.map( (col) => <td>{col}</td>)}</tr>)}
			</table>
		</div>
		);
	}
}