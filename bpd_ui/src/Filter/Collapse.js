import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import "./Collapse.css";

/*
	Displays a clickable header that hides a provided div

	Example:
		<Collapse title="Greeting">
			<div>Hello World!</div>
		</Collapse>
*/

export default class Collapse extends React.Component
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
			<div className="collapsable">
				<div onClick={(e) => {this.setState({show: !this.state.show})}} className="collapse-header">
					{this.props.title}
				</div>
				<div className="collapse-body" style={{display: this.state.show ? "block": "block"}}>
					{this.props.children}
				</div>
			</div>
		);
	}
}