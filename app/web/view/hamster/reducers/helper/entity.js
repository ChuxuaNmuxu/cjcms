import {List, fromJS} from 'immutable';
import * as miaow from '../../utils/miaow';
import * as lodash from 'lodash';
import {immrPick} from '../../utils/utils'

/**
 * 获取特定id的entity
 * @param {*} hamster 
 * @param {*} id 
 */
export const getEntity = hamster => id => hamster.getIn(['entities', id]);

/**
 * entities数据增删改
 * @param {*} hamster 
 * @param {*} payload {ids, operations}
 */
export function handleEntitiesChanges (hamster, payload) {
    const [ids, operations] = miaow.destruction('ids', 'operations')(payload);

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

/**
 * 根据实体类型获取实体集
 * @param {*} hamster 
 * @param {*} type 
 */
export const getEntitiesByType = (hamster, type) => {
    return immrPick(hamster.get('entities'), hamster.getIn(['index', type]));
}

// 用于合并属性
const propsMerger = (a, b) => {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(propsMerger, b)
    }
    return b
}

/**
 * 实体属性变更
 * @param {*} hamster 
 * @param {*} payload 
 */
export const changeEntitiesProps = (hamster, payload) => {
    // 修改props
    return handleEntitiesChanges(hamster, fromJS({
        ids: payload.entityIds,
        operations: {
            'data.props': props => props.mergeWith(propsMerger, payload.props)
        }
    }))
}
