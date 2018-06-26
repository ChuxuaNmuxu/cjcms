import initialState from './initialState';
import * as helper from './helper/helper';
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

const namespace = 'PPT';
const ppt = {
    'INIT': handlePPTInit,
}

export default helper.createReducer(initialState.hamster, ppt, namespace);