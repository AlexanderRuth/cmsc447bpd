import * as Constants from '../constants/constants.js';

//Call when data is being requested
//So loading screens can be shown across components
export const crimeRequest = (filters={}) => {
    console.log("CRIME REQUEST: ", filters)
    return {
        type: Constants.CRIME_REQUEST,
        payload: {
            loading: true,
            filters: filters
        }
    }
}

//Call once the API data is returned
export const crimeResponse = (data, numPages) => {

    let payload = {}
    if(numPages)
        payload.numPages = numPages;
    payload.loading = false;

    return {
        type: Constants.CRIME_RESPONSE,
        payload: payload
    }
}

export const loading = (isLoading) => {
    return {
        type: Constants.RELOAD,
        payload: {
            loading: isLoading
        }
    }
}