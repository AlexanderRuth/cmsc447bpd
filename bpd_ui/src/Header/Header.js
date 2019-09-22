import React from 'react';
import "./Header.css";
import logo from "../img/umbc_logo.png";

var headerItems = {
	"Home": "/home",
	"Charts": "/charts",
	"Tables": "/tables",
	"Help": "/help"
}

export default class Header extends React.Component
{	
	render()
	{
		return(
			<div style={{backgroundColor: "black", width: "100%", height: "100px", display: "block"}}>
				<img src={logo} style={{height: "80px", float: "left", paddingTop: "10px", paddingLeft: "10px"}}/>
				{Object.keys(headerItems).map( (e) => 
					(<div onClick={() => this.onClick(headerItems[e])} className="header-item clickable">{e}</div>)
				)}
				<span className="header-item" style={{fontSize: "30px", float: "right", paddingRight: "40px", color: "lightgrey"}}>Open BPD</span>
			</div>
		);
	}
	
	onClick(link)
	{
		window.location.href = link;
	}
}