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
			heatmap: createHeatmap(),
			show: null
		}
		
		console.log(this.state.heatmap)

		this.createMarkers = this.createMarkers.bind(this);
	}
	
	render()
	{
		const heatmap = createHeatmap();
		console.log(this.state);
		return(
		<div style={{height: "100%", width: "100%"}}>
			<div style={{color: "black", position: 'absolute', top: 0, right: 0, zIndex: 2}}>
				{this.state.show ? JSON.stringify(this.props.data[this.state.show]) : ""}
			</div>
			<GoogleMapReact
				ref={(el) => this._googleMap = el}
				bootstrapURLKeys={{key: Constants.API_KEY}}
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
	
}

const mapStateToProps = (state) => {
	return {
		data: state.crimeReducer.crimes
	}
}

export default connect(mapStateToProps)(CrimeMap);