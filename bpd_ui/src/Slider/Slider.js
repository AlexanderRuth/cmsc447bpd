import React from 'react';
import fetch from 'isomorphic-fetch';
import * as Constants from '../constants/constants.js';
import { connect } from 'react-redux';
import {crimeResponse, crimeRequest} from '../actions/crimeRequest.js';
import "./Slider.css";

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2010, 0, 1);

class Slider extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            divStart: null,
            divEnd: null,
            startDay: new Date(),
            endDay: new Date(),
            max: 0
        }

        this.onValueChanged = this.onValueChanged.bind(this);
        this.barWidth = this.barWidth.bind(this);
        this.barStart = this.barStart.bind(this);
        this.submitFilter = this.submitFilter.bind(this);
    }

    async componentWillMount()
    {
        const secondDate = new Date(await fetch(Constants.API_URL + Constants.LATESTDATE,
        {
            method: "POST"
        }).then(
            (response) => response.json()
        ).then(
            (json) => json
        ));

        secondDate.setDate(secondDate.getDate() + 1)

        console.log("SECOND DATE: ", secondDate);

        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

        var startDay = new Date(2019, 9, 1);
        var MIN = 0
        var MAX = diffDays;

        console.log("MAX: ", MAX);
        this.setState({
            divStart: MAX - 300,
            divEnd: MAX,
            startDay: startDay,
            endDay: secondDate,
            max: MAX,
            maxDate: secondDate,
            minDate: firstDate
        })

    }
    render()
    {

        var MAX = this.state.max;

        if(!MAX)
        {
            return <div style={{width: "100%", height: "100%", backgroundColor: "blacK"}}></div>
        }
        
        return(
            <div className="slider-container" style={{clear: "both", backgroundColor: "black", height: "100%"}}>
                <br/>
                <div style={{display: "inline", margin: "auto", color: "white"}}>{(this.state.startDay > this.state.endDay ? this.state.endDay : this.state.startDay).toDateString()} - {(this.state.startDay > this.state.endDay ? this.state.startDay : this.state.endDay).toDateString()} </div>
                <div style={{color: "lightgrey", float: "left"}}>{this.state.minDate.toDateString()}</div>
                <div style={{color: "lightgrey", float: "right"}}>{this.state.maxDate.toDateString()}</div>

                <div className="slider-middle" style={{left: this.barStart(), width: this.barWidth()}}></div>
                <input onMouseUp={this.submitFilter} defaultValue={MAX - 300} max={MAX} min={0} onChange={(e) => this.onValueChanged(e, "left")} className="slider" type="range"/>
                <input onMouseUp={this.submitFilter} defaultValue={MAX} max={MAX} min={0} className="slider" onChange={(e) => this.onValueChanged(e, "right")} type="range"/>
                
            </div>
        )
    }

    onValueChanged(e, marker)
    {
        var value = e.target.value;

        if(marker == "left")
        {
            var newStart = new Date(firstDate.getTime() + oneDay * value);
            this.setState({divStart: parseInt(value), startDay: newStart});
        }
        else     
        {
            var newEnd = new Date(firstDate.getTime() + oneDay * value);
            this.setState({divEnd: parseInt(value), endDay: newEnd});
        }
    }

    barWidth()
    {
        return (Math.abs(this.state.divStart - this.state.divEnd) / this.state.max) * 100 + "%";
    }

    barStart()
    {
        if(this.state.divStart && this.state.divEnd)
            return (Math.min(this.state.divEnd, this.state.divStart) / this.state.max) * 100 + "%";
        else
            return "0%";
    }

    submitFilter()
    {
        var filters = this.props.filters;
        if(this.state.startDay > this.state.endDay)
        {
            filters["before"] = this.state.startDay;
            filters["after"] = this.state.endDay;
        }
        else
        {
            filters["after"] = this.state.startDay;
            filters["before"] = this.state.endDay;
        }

	//Indicate that a crime request is being made
    this.props.crimeRequest(filters);

    var URL = Constants.API_URL + Constants.FILTER;
		
    //Submit the form data
    fetch(
        URL,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        }
    ).then(
        (response) => response.json()
    ).then(
        //Store the response
        (response) => {this.props.crimeResponse(response.content, response.totalPages)}
    )

    }

}

const mapStateToProps = (state) => {
	return {
		filters: state.crimeReducer.filters
	}
}
const mapDispatchToProps = dispatch => ({
	crimeRequest: (filters={}) => dispatch(crimeRequest(filters)),
	crimeResponse: (data, numPages) => dispatch(crimeResponse(data, numPages))
})

export default connect(mapStateToProps, mapDispatchToProps)(Slider);