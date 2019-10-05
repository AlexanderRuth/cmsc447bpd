import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Collapse from "./Collapse.js";
import './Collapse.css';

export default class Filter extends React.Component
{
	constructor()
	{
		super();
		
		this.state = {
			show: false,
		}
	}
	render()
	{
		return(
			<div style={{width: "100%", backgroundColor: "black", height: "13vh"}}>
				<div className="filter-button" onClick={() => {this.setState({show: !this.state.show})}}>
					Filters
				</div>
				<div style={{display: this.state.show ? "" : "none", position: "absolute", top: "13vh", zIndex: 2, right: 0, width: "30%"}}>
				<Collapse title="Time">
					<form style={{textAlign: "left"}}>
						Committed After: 
						<br/>
						<input type="date"/> <input type="time"/> EST
						<br/>
						Committed Before: 
						<br/>
						<input type="date"/> <input type="time"/> EST
					</form>
				</Collapse>
				<Collapse title="Crimes">
					<form style={{textAlign: "left"}}>
						Name:<br/>
						<select>
							<option value="Foo">Foo</option>
							<option value="bar">Bar</option>
						</select>
						<br/>
						<input type="radio" name="gender" value="male" checked /> Male<br/>
						<input type="radio" name="gender" value="female" /> Female<br/>
						<input type="radio" name="gender" value="other" /> Other
					</form>
				</Collapse>
				<Collapse title="Attributes">
					<form style={{textAlign: "left"}}>
						Name:<br/>
						<select>
							<option value="Foo">Foo</option>
							<option value="bar">Bar</option>
						</select>
						<br/>
						<input type="checkbox" name="gender" value="male"/> Male<br/>
						<input type="checkbox" name="gender" value="female"/> Female<br/>
						<input type="checkbox" name="gender" value="other"/> Other
					</form>
				</Collapse>
				</div>
			</div>
		);
	}
}