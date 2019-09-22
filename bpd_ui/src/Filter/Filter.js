import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Collapse from "./Collapse.js";

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
			<div>
				<div style={{backgroundColor: "gold", height: "30px"}}>
					Filters
				</div>
				<Collapse title="Time">
					<form style={{width: "100%", textAlign: "left"}}>
						Committed After: <input type="date"/> <input type="time"/> EST
						<br/>
						Committed Before: <input type="date"/> <input type="time"/> EST
					</form>
				</Collapse>
				<Collapse title="Crimes">
					<form style={{width: "100%", textAlign: "left"}}>
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
					<form style={{width: "100%", textAlign: "left"}}>
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
		);
	}
}