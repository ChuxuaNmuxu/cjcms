import {fromJS} from 'immutable';

import initialState from './initialState';
import * as entityHelper from './helper/entity'

/**
 * 处理属性变化
 * @param {*} hamster 
 * @param {*} param1 
 */
function handleChangeProps (hamster, {payload}) {
    return entityHelper.changeEntitiesProps(hamster, payload)
}

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : fromJS(state)) : fromJS(initialState)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

const entityType = type => 'ENTITY/' + type;

const entity = {
    [entityType('PROPS_CHANGE')]: handleChangeProps,
}

export default createReducer(initialState.hamster, entity);