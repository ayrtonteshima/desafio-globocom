import { combineReducers } from 'redux';
import interactions from './interactions';
import requests from './requests';

export default combineReducers({
    interactions,
    requests
});
