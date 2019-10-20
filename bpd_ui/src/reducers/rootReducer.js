import {combineReducers} from 'redux';
import crimeReducer from './crimeReducer.js';
import aggregateReducer from './aggregateReducer.js';

export default combineReducers({
    crimeReducer,
    aggregateReducer
})