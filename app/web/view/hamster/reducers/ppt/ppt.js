import * as currentHelper from '../helper/current'

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

/**
 * 保存hamster
 * @param {*} hamster 
 * @param {*} action 
 */
function handleSaveData (hamster, action) {
    if (!action.payload) return hamster;
    return action.payload;
}

export const ppt = {
    'INIT': handlePPTInit,
    'SAVE_DATA': handleSaveData
}
