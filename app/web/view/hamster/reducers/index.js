import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import block from './block'
import slide from './slide'

const hamster = reduceReducers(
    block,
    slide
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
