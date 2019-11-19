import React from 'react';
import Filter from "../Filter/Filter.js";
import "./CrimeTable.css";
import test_data from '../test_data/crimes.json';
import {MDBDataTable} from 'mdbreact';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import {crimeRequest, crimeResponse} from '../actions/crimeRequest.js';
import * as Constants from '../constants/constants.js';

const _ = require("lodash");

const headers = ["crimedate", "crimetime", "crimecode", "location", "description", "inside_outside", "weapon", "post", "district", "neighborhood", "longitude", "latitude", "premise", "total_incidents"]
const PAGE_COUNT = 10;



class CrimeTable extends React.Component
{	
	constructor(props)
	{
		super(props);

		this.state = {
			curPage: -1,
			loading: false,
			pageSize: 5			//Default to five
		}

		this.onPageChange = this.onPageChange.bind(this);
	}

	//Update the rendered data
	componentDidUpdate(prevProps)
	{
		//If stopped loading and was loading, reload the data
		if(!this.props.loading && prevProps.loading)
			this.onPageChange(0);
	}
	
	render()
	{
		return(
		<div style={{backgroundColor: "#DADADA"}}>
			{this.props.loading || this.state.loading ? <div className="loader"/> : null}
			<div style={{width: "100%", filter: this.props.loading || this.state.loading ? "blur(5px)" : ""}}>
				<ReactTable
					data={this.state.data ? this.dataToRow(this.state.data) : this.dataToRow(this.props.data)}
					columns={this.dataToColumn()} 
					defaultPageSize={5}
					page={this.state.curPage}
					pages={this.state.numPages ? this.state.numPages : -1}
					manual
					onPageChange={this.onPageChange}
					onPageSizeChange={
						(pageSize, pageIndex) => {this.setState({pageSize: pageSize}, this.onPageChange(pageIndex, pageSize))}}
					style={{height: "37vh"}}	
					/>
			</div>
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
					sort: 'asc'
				}
			}
		);
	}

	onPageChange(pageIndex, pageSize=null)
	{
		var filters = this.props.filters;
		filters["page_number"] = pageIndex;
		
		if(!pageSize)
			filters["page_size"] = this.state.pageSize;
		else
			filters["page_size"] = pageSize;

		console.log("GOING");
		var URL = Constants.API_URL + Constants.FILTER;
		this.setState({loading: true});

		fetch(URL,
			{
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(filters)
			}
		).then(
			(response) => response.json()
		).then(
			(json) => {this.setState({numPages: json.totalPages, data: json.content, curPage: pageIndex, loading: false})}
		)
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes,
		loading: state.crimeReducer.loading,
		numPages: state.crimeReducer.numPages,
		filters: state.crimeReducer.filters
	}
}

export default connect(mapStateToProps)(CrimeTable);