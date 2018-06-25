import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import entity from './entity'
import block from './block'
import slide from './slide'

const hamster = reduceReducers(
    entity,
    block,
    slide
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
