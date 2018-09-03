import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers'

import entity from './entity'
import block from './block'
import slide from './slide'
import ppt from './ppt'
import nav from './nav'

const hamster = reduceReducers(
    entity,
    block,
    slide,
    ppt,
    nav,
)

let reducers = {
    hamster
};

export default combineReducers(reducers)
