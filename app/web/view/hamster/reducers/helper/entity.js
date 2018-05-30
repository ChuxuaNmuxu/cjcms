import {fromJS} from 'immutable';
import {immrPick} from '../../utils/utils'

/**
 * 获取特定id的entity
 * @param {*} hamster 
 * @param {*} id 
 */
export function getEntity (hamster, id) {
    return hamster.getIn(['entities', id]);
}

/**
 * 根据实体类型获取实体集
 * @param {*} hamster 
 * @param {*} type 
 */
export const getEntitiesByType = (hamster, type) => {
    return immrPick(hamster.get('entities'), hamster.getIn(['index', type]));
}