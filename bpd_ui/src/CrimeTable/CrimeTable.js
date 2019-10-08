import React from 'react';
import Filter from "../Filter/Filter.js";
import "./CrimeTable.css";
import test_data from '../test_data/crimes.json';
import {MDBDataTable} from 'mdbreact';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

const headers = ["crimedate", "crimetime", "crimecode", "location", "description", "inside_outside", "weapon", "post", "district", "neighborhood", "longitude", "latitude", "premise", "vri_name1", "total_incidents"]
const PAGE_COUNT = 10;



class CrimeTable extends React.Component
{	
	constructor()
	{
		super();
	}
	
	render()
	{
		console.log("PROPS: ", this.props)
		return(
		<div style={{width: "100%"}}>
		<ReactTable
			data={this.dataToRow(this.props.data)}
			columns={this.dataToColumn()} 
			defaultPageSize={5}/>
		</div>
		);
	}

	dataToRow(data)
	{
		if(!data)
			return []
		return data.map(
			(entry) => {
				for(var i = 0; i < headers.length; i++)
				{
					if(!entry[headers[i]])
					{
						entry[headers[i]] = "N/A"
					}
				}
				return entry;
			});
	}

	dataToColumn()
	{
		return headers.map(
			(key) => {
				return {
					Header: key,
					accessor: key.toLowerCase(),
					sort: 'asc',
					width: 100
				}
			}
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes
	}
}

export default connect(mapStateToProps)(CrimeTable);