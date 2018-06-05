import {fromJS} from 'immutable';
import * as miaow from '../../Utils/miaow';
import * as lodash from 'lodash';

/**
 * 获取特定id的entity
 * @param {*} hamster 
 * @param {*} id 
 */
export const getEntity = hamster => id => hamster.getIn(['entities', id]);

/**
 * entities数据增删改
 * @param {*} hamster 
 * @param {*} payload
 */
export function handleEntitiesChanges (hamster, payload) {
    const [ids, operations] = miaow.destruction(payload, 'ids', 'operations');

    const objectIds = miaow.toList(ids);
    return hamster.update('entities', entities => {
        return objectIds.reduce((entities, id) => {
            return operations.reduce((entities, operate, path) => {
                const objectPath = [id].concat(path.split('.'))
                return entities.updateIn(objectPath, prop => operate(prop))
            }, entities)
        }, entities);
    }) 
}

export const getProp = hamster => id => propPath => {
    return lodash.flow(
        getEntity(hamster),
        miaow.get('data.props.' + propPath)
    )(id)
}
