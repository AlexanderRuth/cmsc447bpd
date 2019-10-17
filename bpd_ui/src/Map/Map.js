/* global google */
import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Filter from "../Filter/Filter.js";
import GoogleMapReact from 'google-map-react';
import test_data from '../test_data/crimes.json';
import "./CrimeMarker.css";
import * as Constants from '../constants/constants.js';
import {connect} from 'react-redux';

/*
				heatmapLibrary={true}         
				heatmap={JSON.parse(JSON.stringify(this.state.heatmap))
"AIzaSyCHwvB9HjPI1_K9jR0B3ly3mmPswvXXWJc"
*/
	
class CrimeMap extends React.Component
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
			heatmap: null,
			show: null,
			googlemap: null,
			googlemaps: null
		}
		
		console.log(this.state.heatmap)

		this.createMarkers = this.createMarkers.bind(this);
		this.handleApiLoaded = this.handleApiLoaded.bind(this);
	}

	
	render()
	{
		return(
		<div style={{height: "100%", width: "100%", filter: this.props.loading ? "blur(1px)" : ""}}>
			<div style={{color: "black", position: 'absolute', top: 0, right: 0, zIndex: 2}}>
				{this.state.show ? JSON.stringify(this.props.data[this.state.show]) : ""}
			</div>
			<GoogleMapReact
				ref={(el) => this._googleMap = el}
				yesIWantToUseGoogleMapApiInternals
				bootstrapURLKeys={{key: Constants.API_KEY}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				options={{scrollwheel: true, zoomControl: true}}
				heatmapLibrary={true}         
				heatmap={this.createHeatmap(this.props.data)}
				onGoogleApiLoaded={(map, maps) => this.handleApiLoaded(map, maps)}
			>
			</GoogleMapReact>
		
		{/*<img src={bmore_map} style={{width: "70%", height: "550px", overflow: "hidden", float: "left"}}/>*/}
		</div>
		);
	}
	
	createMarkers()
	{
		var markers = [];
		let mark = this.props.data || [];
		
		for(var i = 0; i < mark.length; i++)
		{
			if(mark[i]["latitude"] && mark[i]["longitude"])
				markers.push(
					<div className="crime-marker"
						lat={mark[i]["latitude"]}
						lng={mark[i]["longitude"]}
						onMouseOver={(e) => {this.setState({show: e.target.id})}}
						onMouseOff={()=>{this.setState({show: null})}}
						id={i}>
					</div>
				);
		}
		
		return markers;
	}

	createHeatmap(data)
	{
		console.log("CREATING HEATMAP")
		if(!data)
			return {positions: []}
		
		var heatmapData = {
			positions: [],
			options: {
				radius: 50,
				opacity: 1
			}
		}
		
		for(var i = 0; i < data.length; i++)
		{
			heatmapData.positions.push({
				lat: parseFloat(parseFloat(data[i]["latitude"])),
				lng: parseFloat(parseFloat(data[i]["longitude"]))
			})
		}
		
		console.log(heatmapData);
		return heatmapData;
	}

	handleApiLoaded(map, maps)
	{
		console.log(map, maps);
		this.setState({
			googlemap: map.map,
			googlemaps: map.maps
		})

		console.log("STATE: ", this.state);
	}
	
}

const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes,
		loading: state.crimeReducer.loading
	}
}

export default connect(mapStateToProps)(CrimeMap);