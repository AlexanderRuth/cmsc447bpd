import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Filter from "../Filter/Filter.js";
import GoogleMapReact from 'google-map-react';
import test_data from '../test_data/crimes.json';
import "./CrimeMarker.css";

/*
				heatmapLibrary={true}         
				heatmap={JSON.parse(JSON.stringify(this.state.heatmap))
"AIzaSyCHwvB9HjPI1_K9jR0B3ly3mmPswvXXWJc"
*/
function createHeatmap()
	{
		var heatmapData = {
			positions: [],
			options: {
				radius: 30,
				opacity: .9
			}
		}
		
		for(var i = 0; i < test_data.length; i++)
		{
			heatmapData.positions.push({
				lat: parseFloat(parseFloat(test_data[i]["latitude"])),
				lng: parseFloat(parseFloat(test_data[i]["longitude"]))
			})
		}
		
		console.log(heatmapData);
		return heatmapData;
	}
	
export default class Map extends React.Component
{	
	static defaultProps = {
		center: {
			lat: 39.2904,
			lng: -76.6122
		},
		zoom: 11
	};
	
	constructor()
	{
		super()
		this.state = {
			heatmap: createHeatmap()
		}
		
		console.log(this.state.heatmap)
	}
	
	render()
	{
		const heatmap = createHeatmap();
		return(
		<div style={{height: "100%", width: "100%"}}>
			<GoogleMapReact
				ref={(el) => this._googleMap = el}
				bootstrapURLKeys={{key: "API_KEY_HERE"}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				options={{scrollwheel: true, zoomControl: true}}
			>
			{this.createMarkers()}
			</GoogleMapReact>
		
		{/*<img src={bmore_map} style={{width: "70%", height: "550px", overflow: "hidden", float: "left"}}/>*/}
		</div>
		);
	}
	
	createMarkers()
	{
		var markers = [];
		let mark = test_data
		
		for(var i = 0; i < mark.length; i++)
		{
			if(test_data[i]["latitude"] & test_data[i]["longitude"])
				markers.push(
					<div className="crime-marker"
						lat={test_data[i]["latitude"]}
						lng={test_data[i]["longitude"]}>
					</div>
				);
		}
		
		return markers;
	}
	
}