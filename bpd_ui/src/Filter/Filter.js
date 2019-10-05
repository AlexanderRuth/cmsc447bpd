import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Collapse from "./Collapse.js";
import './Collapse.css';
import fetch from 'isomorphic-fetch';
import * as Constants from '../constants/constants.js';

export default class Filter extends React.Component
{
	constructor()
	{
		super();
		
		this.state = {
			show: false,
			form: {
				before_date: "",
				after_date: "",
				before_time: "",
				after_time: "",
				district: "All",
				weapon: "All",
				crimecode: ""
			}
		}

		this.updateForm = this.updateForm.bind(this);
	}
	render()
	{
		return(
			<div style={{width: "100%", backgroundColor: "black", height: "13vh"}}>
				<div className="filter-button" onClick={() => {this.setState({show: !this.state.show})}}>
					Filters
				</div>
				<div style={{display: this.state.show ? "" : "none", position: "absolute", top: "13vh", zIndex: 2, right: 0, width: "30%"}}>
				<form style={{textAlign: "left"}}>

				<Collapse title="Time">
						Committed After: 
						<br/>
						<input onBlur={this.updateForm} name="after" type="date"/> 
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
						<option value="other">Other</option>
					</select>
				</Collapse>
				<Collapse title="Location">
					District: 
					<br/>
					<select onChange={this.updateForm} name="district">
						<option>All</option>
						<option>Southeast</option>
						<option>Central</option>
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
			form: Object.assign(this.state.form, {[e.target.name]: e.target.value, crimedate: "2018-09-18"})
		})

		console.log("Form update: ", this.state.form);

		var URL = Constants.API_URL + Constants.FILTER + "?" + Object.keys(this.state.form).map(
			(param) => {
				return param + "=" + this.state.form[param];
			}).join("&");

		console.log("URL = ", URL);
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
			(response) => console.log("Response: ", response)
		)
	}
}