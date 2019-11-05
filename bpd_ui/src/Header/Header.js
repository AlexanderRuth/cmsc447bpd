import React from 'react';
import "./Header.css";
import logo from "../img/umbc_logo.png";
import {Link} from "react-router-dom";

var headerItems = {
	"Home": "/home",
}

export default class Header extends React.Component
{	
	render()
	{
		return(
			<div style={{backgroundColor: "black",height: "100%", display: "block"}}>
				<img src={logo} style={{height: "12vh", float: "left", paddingTop: "1vh", paddingLeft: "15px"}}/>
				
				{Object.keys(headerItems).map( (e) => 
					(<Link to={headerItems[e]} className="header-item clickable">{e}</Link>)
				)}
			</div>
		);
	}
}