import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import "./Collapse.css";

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
			<div className="collapse">
				<div onClick={(e) => {this.setState({show: !this.state.show})}} className="collapse-header">{this.props.title}</div>
				<div className="collapse-body" style={{display: this.state.show ? "block": "none"}}>
					{this.props.children}
				</div>
			</div>
		);
	}
}