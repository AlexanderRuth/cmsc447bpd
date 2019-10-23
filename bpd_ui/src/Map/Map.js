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
import fetch from 'isomorphic-fetch';
import {crimeResponse, crimeRequest} from '../actions/crimeRequest.js';

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
			show: null,					//Show a hovered over marker
			map: null,					//Reference to the google map
			google: null,				//Google library
			showDrawSettings: false,	//Display rectangle draw options
			boxMoved: false,			//Was the box moved since the last submit?
		}

		this.createMarkers = this.createMarkers.bind(this);
		this.handleApiLoaded = this.handleApiLoaded.bind(this);
		this.showOrHideBox = this.showOrHideBox.bind(this);
		this.submitBoundingBox = this.submitBoundingBox.bind(this);
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
			<div ref={(el) => this._drawIcon = el} className="draw-icon" onClick={() => {this.setState({showDrawSettings: !this.state.showDrawSettings});}}>
				<i className="fa fa-pencil" style={{fontSize: "20px"}}/>
			</div>

	
			<div ref={(el) => this._drawSettings = el} className="draw-settings" style={{display: this.state.showDrawSettings ? "" : "none"}}>
				Bounding Box:<br/>
				<button onClick={() => {this.showOrHideBox()}}> {this.state.showBox ? "Hide" : "Show"}</button>
				{this.state.boxSelection ? <button onClick={() => {this.submitBoundingBox(null)}}>Clear Selection</button> : null}
				{this.state.boxMoved && this.state.showBox ? <div><br/><button onClick={() => this.submitBoundingBox(this.state.bounds)}>Submit Selection</button></div> : null}
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

		this.heatmapData = heatmapData;
		return heatmapData;
	}

	handleApiLoaded(google)
	{
		const map = google.map

		//Save the google library and the google map
		this.setState({
			google: google,
			map: map
		})

		//Default rectangle coordinates
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
		
		//Keep track of the newly created rectangle
		this.setState({
			rectangle: myRectangle
		})

		//Store the rectangle bounds as a state when rectangle changes bounds
		myRectangle.addListener('bounds_changed', (e) => {
			var bounds = this.state.rectangle.getBounds();
			this.setState({
				bounds: {
					northBoundary: bounds.getNorthEast().lat(),
					eastBoundary: bounds.getNorthEast().lng(),
					southBoundary: bounds.getSouthWest().lat(),
					westBoundary: bounds.getSouthWest().lng()
				},
				boxMoved: true
			});
		})

		//Add custom google map controls (Draw Button, Draw Settings, Submit Button)
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawIcon);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawSettings);
	}

	showOrHideBox()
	{
		if(this.state.showBox)
		{
			this.state.rectangle.setMap(null);
			this.setState({showBox: false});
		}
		else
		{
			this.state.rectangle.setMap(this.state.map);
			this.setState({showBox: true});
		}
	}

	submitBoundingBox(bounds)
	{
		var filtersToUse = this.props.filters;

		if(!bounds){
			delete filtersToUse["northBoundary"];
			delete filtersToUse["southBoundary"];
			delete filtersToUse["westBoundary"];
			delete filtersToUse["eastBoundary"];
		}
		
		filtersToUse = Object.assign({}, filtersToUse, bounds);

		var URL = Constants.API_URL + Constants.FILTER + "?" + Object.keys(filtersToUse).map(
			(param) => {
				return param + "=" + filtersToUse[param];
			}).join("&");

		//Indicate that a crime request is being made
		this.props.crimeRequest(filtersToUse);

		//Submit the form data
		fetch(
			URL,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.props.crimeResponse(response)}
		)

		if(bounds)
			this.setState({boxSelection: true});
		else
			this.setState({boxSelection: false})
	}
	
}

const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes,
		loading: state.crimeReducer.loading,
		filters: state.crimeReducer.filters
	}
}

const mapDispatchToProps = dispatch => ({
	crimeRequest: (filters={}) => dispatch(crimeRequest(filters)),
	crimeResponse: (data) => dispatch(crimeResponse(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(CrimeMap);