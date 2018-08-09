import {List} from 'immutable'
import {getEntitiesByType} from './entity'

/**
 * 根据 slide id 数组获取 slide index 数组
 * @param {*} hamster 
 * @param {*} slideIds 
 */
export const getSlideIdxesBySlideIds = (hamster, slideIds) => {
    return slideIds.size ? hamster.getIn(
        ['index', 'slides']
    ).toKeyedSeq()
    .filter(
        (slideId, index) => slideIds.includes(slideId)
    ).keySeq()
    .toList() : List();
}

/**
 * 获取group内的 slide index 数组
 * @param {*} hamster 
 * @param {*} groupId 
 */
export const getSlideIdxesByGroupId = (hamster, groupId) => {
    const slideIds = hamster.getIn(['entities', groupId, 'data', 'slides']);
    return getSlideIdxesBySlideIds(hamster, slideIds);
}

export const getSlideIdxesByGroupIndex = (hamster, groupIndex) => {
    const groupId = hamster.getIn(['index', 'slide.groups', groupIndex]);
    return getSlideIdxesByGroupId(hamster, groupId);
}

/**
 * 获取slide.group实体集
 * @param {*} hamster 
 */
export const getGroups = (hamster) => {
    return getEntitiesByType(hamster, 'slide.groups')
}

/**
 * 获取slide所属的卡片组
 * @param {*} hamster 
 * @param {*} slideId 
 */
export const getGroupBySlideId = (hamster, slideId) => {
    return getGroups(hamster).find(item => item.getIn(['data', 'slides']).includes(slideId))
}

/**
 * 获取slide所属的卡片组的id
 * @param {*} hamster 
 * @param {*} slideId 
 */
export const getGroupIdBySlideId = (hamster, slideId) => {
    return getGroupBySlideId(hamster, slideId).get('id');
}

/**
 * TODO:
 * 移到entity
 * @param {*} hamster 
 * @param {*} param1 
 */
export const getEntityByIndex = (hamster, {index = 0, type}) => {
    index = index === 'first' ? 0 : index === 'last' ? -1 : index;
    return hamster.getIn(['entities', hamster.getIn(['index', type]).get(index)]);
}

export const getSlideByIndex = (hamster, index) => {
    return getEntityByIndex(hamster, {type: 'slides', index});
}

export const getSlideGroupByIndex = (hamster, index) => {
    return getEntityByIndex(hamster, {type: 'slide.groups', index});
}

//
export const snap = (hamster) => {
    return hamster;
}
