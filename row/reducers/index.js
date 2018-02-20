// reducers/index.js

import { combineReducers } from 'redux';
import watch from './watch';

const rootReducer = combineReducers({
    watch
});

export default rootReducer;