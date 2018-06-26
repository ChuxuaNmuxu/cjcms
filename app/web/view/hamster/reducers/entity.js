import initialState from './initialState';
import * as entityHelper from './helper/entity'
import {createReducer} from './helper/helper'

/**
 * 处理属性变化
 * @param {*} hamster 
 * @param {*} param1 
 */
function handleChangeProps (hamster, {payload}) {
    return entityHelper.changeEntitiesProps(hamster, payload)
}

const namespace = 'ENTITY';
const entity = {
    'PROPS_CHANGE': handleChangeProps,
}

export default createReducer(initialState.hamster, entity, namespace);