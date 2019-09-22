import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Filter from "../Filter/Filter.js";

export default class Map extends React.Component
{	
	render()
	{
		return(
		<div>
			<img src={bmore_map} style={{width: "70%", height: "550px", overflow: "hidden", float: "left"}}/>
			<Filter/>
		</div>
		);
	}
}