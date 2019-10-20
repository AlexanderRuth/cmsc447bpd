import * as Constants from '../constants/constants.js';

//Call when data is being requested
//So loading screens can be shown across components
export const aggregateRequest = (groupBy) => {
    return {
        type: Constants.AGGREGATE_REQUEST,
        payload: {
            chartLoading: true,
            groupBy: groupBy
        }
    }
}

//Call once the API data is returned
export const aggregateResponse = (data) => {

    return {
        type: Constants.AGGREGATE_RESPONSE,
        payload: {
            chartLoading: false,
            aggregate: data
        }
    }
}