import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import entity from './entity'
import block from './block'
import slide from './slide'
import ppt from './ppt'

const hamster = reduceReducers(
    entity,
    block,
    slide,
    ppt
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
