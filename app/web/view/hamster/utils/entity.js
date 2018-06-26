import {fromJS, Map} from 'immutable'
import uuid from 'uuid'

/**
 * 递归提取实体属性值
 * @param {*} entity
 */
const extractEntityProps = (entity) => {
    return entity.get('props')
        .reduce(
            (reduction, v, k) => reduction.set(k, v.has('props') ? extractEntityProps(v) : v.get('value')),
            Map()
        )
}

/**
 * 创建实体
 * @param {*} type 实体类型
 * @param {*} data 实体数据
 */
const createEntity = (type, data) => {
    return fromJS({
        id: `${type}-${uuid.v4()}`,
        type,
        data
    })
}

export {
    extractEntityProps, // 递归提取实体属性值
    createEntity // 创建实体
}
