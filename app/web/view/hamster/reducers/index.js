import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import block from './block'

const hamster = reduceReducers(
    block
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
