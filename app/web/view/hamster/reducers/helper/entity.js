import {fromJS} from 'immutable';

/**
 * 获取特定id的entity
 * @param {*} hamster 
 * @param {*} id 
 */
export function getEntity (hamster, id) {
    return hamster.getIn(['objects', id]);
}