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

const _ = require("lodash");

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
			drawing: false,				//Drawing freeform?
			data: []
		}

		this.createMarkers = this.createMarkers.bind(this);
		this.handleApiLoaded = this.handleApiLoaded.bind(this);
		this.showOrHideBox = this.showOrHideBox.bind(this);
		this.submitBoundingBox = this.submitBoundingBox.bind(this);
		this.callIfResized = this.callIfResized.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.showHidePolygon = this.showHidePolygon.bind(this);
	}
	componentDidUpdate(prevProps)
	{
		if(!this._googleMap)
			return;

		if(this.props.loading || !prevProps.loading)
			return;

		var URL = Constants.API_URL + Constants.LATLONG;

		var filters = this.props.filters;

		this.setState({loading: true});
		//Submit the form data
		fetch(
			URL,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filters)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.setState({data: response.content}); this.props.crimeResponse(response)}
		)
	}
	
	render()
	{
		return(
		<div style={{cursor: this.state.canDraw ? "crosshair" : "", height: "100%", width: "100%", filter: this.props.loading || this.state.loading ? "blur(2px)" : ""}}>
			{this.state.loading ? <div className="loader"/> : null}
			<div style={{color: "black", position: 'absolute', top: 0, right: 0, zIndex: 2}}>
				{this.state.show ? JSON.stringify(this.props.data[this.state.show]) : ""}
			</div>
			<GoogleMapReact
				ref={(el) => this._googleMap = el}
				yesIWantToUseGoogleMapApiInternals
				bootstrapURLKeys={{key: Constants.API_KEY, libraries: ['drawing'].join(',')}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				options={{scrollwheel: true, zoomControl: true, gestureHandling: (this.state.canDraw ? "none" : "all")}}
				heatmapLibrary={true}         
				heatmap={this.heatmap(this.state.data)}
				onGoogleApiLoaded={(google) => this.handleApiLoaded(google)}
			>
			</GoogleMapReact>

			{/*GOOGLE MAP CONTROL OPTIONS*/}
			<div ref={(el) => this._drawIcon = el} className="draw-icon" onClick={() => {this.setState({showDrawSettings: !this.state.showDrawSettings});}}>
				<i className="fa fa-pencil" style={{fontSize: "20px"}}/>
			</div>

	
			<div ref={(el) => this._drawSettings = el} className="draw-settings" style={{display: this.state.showDrawSettings ? "" : "none"}}>
				Drawing:<br/>
				
				{this.state.showBox || this.state.drawSelection ? <button onClick={() => {this.showHidePolygon()}}>Hide/Show</button>: null}
				{this.state.canDraw || this.state.drawSelection ? null : <button onClick={() => {this.showOrHideBox()}}>Box</button>}
				{this.state.boxSelection || this.state.drawSelection ? <button onClick={() => {this.state.drawSelection ? this.clearDrawSelection() : this.submitBoundingBox(null)}}>Clear Selection</button> : null}
				{this.state.drawSelection || this.state.boxSelection || (this.state.rectangle && this.state.rectangle.map) ? null : <button onClick={()=>{this.state.map.setOptions({draggableCursor: this.state.canDraw ? "default" : "crosshair"}); this.setState({canDraw: this.state.canDraw ? false : true})}}>Freeform</button>}
				{/*this.state.boxMoved && this.state.showBox ? <div><br/><button onClick={() => this.submitBoundingBox(this.state.bounds)}>Submit Selection</button></div> : null*/}
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
		let mark = this.state.data || [];

		for(var i = 0; i < mark.length; i++)
		{
			if(mark[i]["lat"] && mark[i]["lng"])
				markers.push(
					<div className="crime-marker"
						lat={mark[i]["lat"]}
						lng={mark[i]["lng"]}
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
		if(!data)
			return {positions: []}
		
		var heatmapData = {
			positions: [],
			options: {
				opacity: .8,
				weight: 10,
				maxIntensity: 30
			}
		}
		
		for(var i = 0; i < data.length; i++)
		{
			heatmapData.positions.push({
				lat: parseFloat(parseFloat(data[i]["lat"])),
				lng: parseFloat(parseFloat(data[i]["lng"]))
			})
		}

		this.heatmapData = heatmapData;
		this.setState({loading: false})
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

		google.maps.event.addListener(map, 'mousedown', () => {if(this.state.canDraw) this.setState({drawing: true})})
		google.maps.event.addListener(map, 'mouseup', () => {this.finishPolyline(); this.setState({drawing: false, canDraw: false})})
		google.maps.event.addListener(map, 'mousemove', this.onMouseMove);

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
			let prevState = this.state.bounds;
			let newState = {
				bounds: {
					northBoundary: bounds.getNorthEast().lat(),
					eastBoundary: bounds.getNorthEast().lng(),
					southBoundary: bounds.getSouthWest().lat(),
					westBoundary: bounds.getSouthWest().lng()
				},
				boxMoved: true
			};

			this.setState(newState, () => this.callIfResized(newState.bounds, prevState, () => {this.submitBoundingBox(this.state.bounds)}))
		})

		
		myRectangle.addListener('mouseup', (e) => {
			this.submitBoundingBox(this.state.bounds);
			this.setState({dragging: false});
		});

		myRectangle.addListener('mousedown', (e) => {
			this.setState({dragging: true});
		})

		//Add custom google map controls (Draw Button, Draw Settings, Submit Button)
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawIcon);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._drawSettings);
	}

	showHidePolygon()
	{
		if(this.state.drawSelection)
			this._mapDrawingPolygon.setMap(this._mapDrawingPolygon.map ? null : this.state.map)
		else
			this.state.rectangle.setMap(this.state.rectangle.map ? null : this.state.map);
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
			delete filtersToUse["points"]
		}
		else{
			bounds = [ 
						{lat: bounds.northBoundary, lng: bounds.eastBoundary}, 
						{lat: bounds.southBoundary, lng: bounds.eastBoundary},
						{lat: bounds.southBoundary, lng: bounds.westBoundary},
						{lat: bounds.northBoundary, lng: bounds.westBoundary}
					]
			bounds = {points: bounds}
		}
		
		filtersToUse = Object.assign({}, filtersToUse, bounds);

		var URL = Constants.API_URL + Constants.FILTER;

		//Indicate that a crime request is being made
		this.props.crimeRequest(filtersToUse);

		//Submit the form data
		fetch(
			URL,
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filtersToUse)
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

	//Call the callback function only if the rectangle has been resized, not moved
	callIfResized(curr, prev, callback)
	{
		if(!curr || !prev)
			return;
		
		//If mouse is down (box is being dragged), don't fetch the new data
		if(!this.state.dragging)
			callback();
	}

	onMouseMove(event)
	{
		if(!this.state.drawing || !this.state.canDraw)
			return;

		if(!this._mapDrawing)
		{
			console.log("Creating");
			var mapDrawing = new this.state.google.maps.Polyline({
				path: [event.latLng],
				geodesic: true,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				clickable: false
			});

			mapDrawing.setMap(this.state.map);
			this._mapDrawing = mapDrawing;
		}

		else
		{
			this._mapDrawing.getPath().push(event.latLng);
		}
	}

	clearDrawSelection()
	{
		if(!this._mapDrawingPolygon)
			return

		var filters = this.props.filters;
		delete filters["points"];

		//Indicate that a crime request is being made
		this.props.crimeRequest(filters);

		var URL = Constants.API_URL + Constants.LATLONG;

		//Submit the form data
		fetch(
			URL,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filters)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.setState({data: response.content}); this.props.crimeResponse(response)}
		)

		this._mapDrawingPolygon.setMap(null);
		this.setState({drawSelection: false, drawing: false});
		this._mapDrawingPolygon = null;
		this._mapDrawing = null;
	}

	finishPolyline()
	{

		if(!this._mapDrawing || !this.state.drawing)
			return;
			
		this._mapDrawing.setMap(null);

		this._mapDrawingPolygon = new this.state.google.maps.Polygon({
			path: this._mapDrawing.getPath(),
			geodesic: true,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2,
			draggable: false,
			fillColor: '#F0F000',
			fillOpacity: 0.35,
		})

		this._mapDrawingPolygon.setMap(this.state.map);

		//Prepare filters
		var filters = this.props.filters;
		filters["points"] = [];

		for(var point = 0; point < this._mapDrawing.getPath().getLength(); point++)
		{
			filters["points"].push({lat: this._mapDrawing.getPath().getAt(point).lat(), lng: this._mapDrawing.getPath().getAt(point).lng()});
		}

		//Indicate that a crime request is being made
		this.props.crimeRequest(filters);

		var URL = Constants.API_URL + Constants.LATLONG;

		this.setState({loading: true});
		//Submit the form data
		fetch(
			URL,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(filters)
			}
		).then(
			(response) => response.json()
		).then(
			//Store the response
			(response) => {this.setState({data: response.content}); this.props.crimeResponse(response)}
		)

		this.setState({drawSelection: true, drawing: false});
		this.state.map.setOptions({draggableCursor: ""});

	}
	
}

const mapStateToProps = (state) => {
	return {
		loading: state.crimeReducer.loading,
		filters: state.crimeReducer.filters,
		data: state.crimeReducer.crimes,
	}
}

const mapDispatchToProps = dispatch => ({
	crimeRequest: (filters={}) => dispatch(crimeRequest(filters)),
	crimeResponse: (data) => dispatch(crimeResponse(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(CrimeMap);