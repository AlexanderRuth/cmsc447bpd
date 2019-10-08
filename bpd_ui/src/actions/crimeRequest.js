import * as Constants from '../constants/constants.js';

//Call when data is being requested
//So loading screens can be shown across components
export const crimeRequest = () => {
    return {
        type: Constants.CRIME_REQUEST,
        payload: {
            loading: true
        }
    }
}

//Call once the API data is returned
export const crimeResponse = (data) => {
    return {
        type: Constants.CRIME_RESPONSE,
        payload: {
            loading: false,
            crimes: data
        }
    }
}