import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Collapse from "./Collapse.js";
import './Collapse.css';
import fetch from 'isomorphic-fetch';
import * as Constants from '../constants/constants.js';
import { connect } from 'react-redux';
import {crimeResponse, crimeRequest} from '../actions/crimeRequest.js';

/*
	Filter Form that displays alongside the webpage header. Collapsables appear on click, which
	then contain form data. When data is off focused or changed, an API call is initiated, and the
	Redux store is updated.
*/

const DISTRICTS = ["ALL", "NORTHERN", "NORTHEAST", "NORTHWEST", "SOUTHERN", "SOUTHEAST", "SOUTHWEST", "CENTRAL", "EASTERN", "WESTERN"];
const DEFAULT_FILTERS = {
	after: "2019-09-10"
}

class Filter extends React.Component
{
	constructor()
	{
		super();
		
		//show: Whether to show the filter options or not
		//form: The form parameters to send to the API
		this.state = {
			show: false,
			form: {
				before: "",
				after: DEFAULT_FILTERS.after,
				before_time: "",
				after_time: "",
				district: "All",
				weapon: "All",
				crimecode: ""
			}
		}

		this.updateForm = this.updateForm.bind(this);
	}

	componentDidMount()
	{
		var filtersAndValues = {}

		var URL = Constants.API_URL + Constants.FILTER;
		
		Object.keys(DEFAULT_FILTERS).map(
			(param) => {
				filtersAndValues[param] = DEFAULT_FILTERS[param];
		})

		console.log("FILTERS AND VALUES: ", filtersAndValues);

		//Indicate that a crime request is being made
		this.props.crimeRequest(filtersAndValues);

		//Submit the form data
		fetch(
			URL,
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filtersAndValues)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.props.crimeResponse(response.content, response.totalPages)}
		)
	}

	render()
	{
		return(
			<div style={{width: "100%", backgroundColor: "black", height: "100%"}}>

				{/*Button to open/close filter*/}
				<div className="filter-button" onClick={() => {this.setState({show: !this.state.show})}}>
					Filters
				</div>
				<div style={{display: this.state.show ? "" : "none", position: "absolute", top: "13vh", zIndex: 2, right: 0, width: "100%"}}>
				
				<form style={{textAlign: "left"}}>
				<Collapse title="Time">
						Committed After: 
						<br/>
						<input defaultValue={DEFAULT_FILTERS.after} onBlur={this.updateForm} name="after" type="date"/> 
						<input onBlur={this.updateForm} name="after_time" type="time"/> EST
						<br/>
						Committed Before: 
						<br/>
						<input onBlur={this.updateForm} name="before" type="date"/> 
						<input onBlur={this.updateForm} name="before_time" type="time"/> EST

				</Collapse>
				<Collapse title="Crimes">
					Crimecode:
					<br/>
					<input onBlur={this.updateForm} name="crimecode" maxLength={3}/>
					<br/>
					Weapon: 
					<br/>
					<select onChange={this.updateForm} name="weapon">
						<option value="all">All</option>
						<option value="firearm">Firearm</option>
						<option value="hands">Hands</option>
						<option value="fire">Fire</option>
						<option value="knife">Knife</option>
						<option value="other">Other</option>
					</select>
				</Collapse>
				<Collapse title="Location">
					District: 
					<br/>
					<select onChange={this.updateForm} name="district">
						{DISTRICTS.map( (entry) => 
							<option>{entry}</option>
						)}
					</select>
				</Collapse>
				</form>
				</div>
			</div>
		);
	}

	//Update the change form field
	updateForm(e)
	{
		//Update the particular entry
		this.setState({
			form: Object.assign(this.state.form, {[e.target.name]: e.target.value})
		});

		var filtersToUse = Object.keys(this.state.form).filter(
			(param) => this.state.form[param] != "" && this.state.form[param].toLowerCase() != "all"
		)

		var filtersAndValues = {}

		//Prepare the query parameters and URL
		var URL = Constants.API_URL + Constants.FILTER; 

		filtersToUse.map(
			(param) => {
				filtersAndValues[param] = this.state.form[param];
		})

		console.log("THIS.PROPS.FILTERS: ", this.props.filters)

		if(this.props.filters.points)
			filtersAndValues = Object.assign({}, filtersAndValues, {"points": this.props.filters.points});

		console.log("Filters and Values: ", filtersAndValues)

		//Indicate that a crime request is being made
		this.props.crimeRequest(filtersAndValues);

		//Submit the form data
		fetch(
			URL,
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filtersAndValues)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.props.crimeResponse(response.content, response.totalPages)}
		)
	}
}

const mapStateToProps = (state) => {
	return {
		filters: state.crimeReducer.filters
	}
}
const mapDispatchToProps = dispatch => ({
	crimeRequest: (filters={}) => dispatch(crimeRequest(filters)),
	crimeResponse: (data, numPages) => dispatch(crimeResponse(data, numPages))
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter);