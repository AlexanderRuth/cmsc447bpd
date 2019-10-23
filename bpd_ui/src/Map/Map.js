/* global google */
import React from 'react';
import bmore_map from "../img/baltimore.jpg";
import Filter from "../Filter/Filter.js";
import GoogleMapReact from 'google-map-react';
import test_data from '../test_data/crimes.json';
import "./CrimeMarker.css";
import * as Constants from '../constants/constants.js';
import {connect} from 'react-redux';
import memoize from "memoize-one";


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

	//Memoization allows for the component to rerender without having to recompute
	//createHeatmap if this.props.data did not change :)
	heatmap = memoize(
		(data) => {return this.createHeatmap(data)}
	)
	
	constructor()
	{
		super()
		this.state = {
			heatmap: null,
			show: null,
			googlemap: null,
			googlemaps: null
		}

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
				bootstrapURLKeys={{key: Constants.API_KEY, libraries: ['drawing'].join(',')}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				options={{scrollwheel: true, zoomControl: true}}
				heatmapLibrary={true}         
				heatmap={this.heatmap(this.props.data)}
				onGoogleApiLoaded={(google) => this.handleApiLoaded(google)}
			>
			</GoogleMapReact>

			{/*GOOGLE MAP CONTROL OPTIONS*/}
			<div ref={(el) => this._drawIcon = el} className="draw-icon" style={{display: "none"}} onClick={() => {this.setState({showDrawSettings: !this.state.showDrawSettings});}}>
				<i className="fa fa-pencil" style={{fontSize: "20px"}}/>
			</div>

			
			<div ref={(el) => this._drawSettings = el} className="draw-settings" style={{display: this.state.showDrawSettings ? "" : "none"}}>
				<button onClick={() => {this.state.rectangle.setMap(null)}}>Hide Box</button>
				<button onClick={() => {this.state.rectangle.setMap(this.state.map)}}>Show Box</button>
			</div>


			{this.state.ne ? 
			<div style={{backgroundColor: "black", position: "absolute", top: 0, left: 0, padding: 10, color: "white"}}>
				{"Lat: " + this.state.ne[0] + " Long: " + this.state.ne[1]}
			</div>
			: null}

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
		this.heatmapData = heatmapData;
		return heatmapData;
	}

	handleApiLoaded(google)
	{
		const map = google.map

		console.log("GOOGLE: ", google);
		this.setState({
			googlemap: google,
			map: map
		})

		var rectCoords = [
			new google.maps.LatLng(39.1000, -76.6122),
			new google.maps.LatLng(39.2000, -76.6122),
			new google.maps.LatLng(39.1000, -76.6000),
			new google.maps.LatLng(39.2000, -76.6000)
		  ];

		  // Styling & Controls
		var myRectangle= new google.maps.Rectangle({
			paths: rectCoords,
			draggable: true,
			editable: true,
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#F0F000',
			fillOpacity: 0.35,
			bounds: {
				north: 39.2904,
				south: 39.2000,
				east: -76.6000,
				west: -76.7000,
			},
		  });
		
		myRectangle.setMap(map)

		this.setState({
			rectangle: myRectangle
		})

		myRectangle.addListener('bounds_changed', (e) => {
			var bounds = this.state.rectangle.getBounds();
			this.setState({
				ne: [bounds.getNorthEast().lat(), bounds.getNorthEast().lng()],
				sw: [bounds.getSouthWest().lat(), bounds.getSouthWest().lng()]
			});
		})

		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawIcon);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawSettings);

		
		this._drawIcon.style.display = "";

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