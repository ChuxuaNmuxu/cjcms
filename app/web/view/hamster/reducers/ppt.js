import Immutable from 'immutable';

import initialState from './initialState';
import * as helper from './helper/helper';
import * as miaow from '../Utils/miaow';
import * as currentHelper from './helper/current'

/**
 * 初始化PPT
 * @param {*} hamster 
 * @param {*} action 
 */
function handlePPTInit (hamster, action) {
    // ppt editor 的初始化工作
    // 当前操作的slide, 默认为第一张ppt
    const firstSlideId = hamster.getIn(['index', 'slides', 0])
    hamster = currentHelper.updateCurrent(hamster)('operatingSlideId')(firstSlideId);

    return hamster;
}

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : Immutable.fromJS(state)) : Immutable.fromJS(initialState)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

const pptType = type => 'PPT/' + type;

const ppt = {
    [pptType('INIT')]: handlePPTInit,
}

export default createReducer(initialState.hamster, ppt);