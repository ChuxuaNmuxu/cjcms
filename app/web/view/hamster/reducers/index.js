import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import block from './block'
import slide from './slide'
import ppt from './ppt'

const hamster = reduceReducers(
    block,
    slide,
    ppt
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
