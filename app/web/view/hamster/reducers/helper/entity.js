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
 * 更新单个entity
 * @param {*} operations  operations: {path: operate}
 */
export const udpateEntity = operations => entity => operations.reduce((entity, operate, path) => {
    const objectPath = path.split('.');
    if (objectPath.some(miaow.not(miaow.existy))) return entity;
    operate = lodash.isFunction(operate) ? operate : miaow.always(operate)
    return entity.updateIn(objectPath, operate)
}, entity)

/**
 * 更新entities
 * @returns entities
 * @param {*} payload 
 * @param {*} entities 
 */
export const updateEntities = payload => entities => {
    const [ids, operations] = miaow.destruction('ids', 'operations')(payload);
    const objectIds = miaow.toList(ids);

    return objectIds.reduce((entities, id) => {
        if (!miaow.existy(id)) return entities;

        return entities.update(id, udpateEntity(operations))
    }, entities);
}

/**
 * entities数据增删改
 * @param {*} hamster 
 * @param {*} payload {ids, operations: {path: operate}}
 * @returns hamster
 */
export function handleEntitiesChanges (hamster, payload) {
    return hamster.update('entities', updateEntities(payload)) 
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
