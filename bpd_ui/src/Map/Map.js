import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Filter from "../Filter/Filter.js";
import GoogleMapReact from 'google-map-react';

export default class Map extends React.Component
{	
	static defaultProps = {
		center: {
			lat: 39.2904,
			lng: -76.6122
		},
		zoom: 11
	};
	
	render()
	{
		return(
		<div style={{height: "86.5vh", width: "70%", float: "left"}}>
			<GoogleMapReact
				bootstrapURLKeys={{key: "AIzaSyAb2DQ97vUtf5SekHnVp5Mh-UcXsJ_26tU"}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				options={{scrollwheel: true, zoomControl: true}}
			>
			
			</GoogleMapReact>
		
		{/*<img src={bmore_map} style={{width: "70%", height: "550px", overflow: "hidden", float: "left"}}/>*/}
		</div>
		);
	}
}