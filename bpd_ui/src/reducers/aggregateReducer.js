import * as Constants from '../constants/constants.js';

//Reduce Aggregate Counts
//payload = {
//  aggregate: []    
//}
export default (state = {}, action) => {
    switch(action.type) {
        case Constants.AGGREGATE_REQUEST:
            return Object.assign({}, state, action.payload);
        case Constants.AGGREGATE_RESPONSE:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}