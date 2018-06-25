import {fromJS, Map} from 'immutable'
import uuid from 'uuid'

/**
 * 递归提取属性值
 * @param {*} entity
 */
const extractProps = (entity) => {
    return entity.get('props')
        .reduce(
            (reduction, v, k) => reduction.set(k, v.has('props') ? extractProps(v) : v.get('value')),
            Map()
        )
}

/**
 * 创建实体
 * @param {*} type 
 * @param {*} data 
 */
const createEntity = (type, data) => {
    return fromJS({
        id: `${type}-${uuid.v4()}`,
        type,
        data
    })
}

export {
    extractProps,
    createEntity
}
