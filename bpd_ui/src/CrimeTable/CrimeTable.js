import React from 'react';
import Filter from "../Filter/Filter.js";
import "./CrimeTable.css";
import test_data from '../test_data/crimes.json';
import {MDBDataTable} from 'mdbreact';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const headers = ["crimedate", "crimetime", "crimecode", "location", "description", "inside_outside", "weapon", "post", "district", "neighborhood", "longitude", "latitude", "premise", "vri_name1", "total_incidents"]
const PAGE_COUNT = 10;



export default class CrimeTable extends React.Component
{	
	constructor()
	{
		super();
		
		this.state = {
			page: 1,
			data: {
				columns:
					headers.map( (key) => {
						return {Header: key,
						accessor: key.toLowerCase(),
						sort: 'asc',
						width: 100
						}
					}),
				rows: JSON.parse(JSON.stringify(test_data)).map(
					(entry) => {
						for(var i = 0; i < headers.length; i++)
						{
							if(!entry[headers[i]])
							{
								entry[headers[i]] = "N/A"
							}
						}
						return entry;
					}
				)
			}
		}
		
		console.log(this.state.data)
	}
	
	render()
	{
		return(
		<div style={{width: "100%"}}>
		<ReactTable
			data={this.state.data.rows}
			columns={this.state.data.columns} 
			defaultPageSize={5}/>
		</div>
		);
	}
}