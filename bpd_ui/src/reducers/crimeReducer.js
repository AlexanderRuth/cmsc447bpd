import * as Constants from '../constants/constants.js';

//Reduce Crime API Requests
export default (state = {}, action) => {
    console.log(action.type, action.payload);
    console.log(state);
    switch(action.type) {
        case Constants.CRIME_REQUEST:
            return Object.assign({}, state, action.payload);
        case Constants.CRIME_RESPONSE:
            return Object.assign({}, state, action.payload);
        case Constants.RELOAD:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}