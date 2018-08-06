import * as entityHelper from '../helper/entity'

/**
 * 处理属性变化
 * @param {*} hamster 
 * @param {*} param1 
 */
function handleChangeProps (hamster, {payload}) {
    return entityHelper.changeEntitiesProps(hamster, payload)
}

const handleEntitiesChange = (hamster, {payload}) => entityHelper.handleEntitiesChanges(hamster, payload)

export const entity = {
    'PROPS_CHANGE': handleChangeProps,
    'ENTITIES_CHANGE': handleEntitiesChange
}
