import {fromJS, List} from 'immutable';

import initialState from './initialState';

// 这里处理Hamster数据获取和保存

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : fromJS(state)) : fromJS(initialState.hamster)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

const hamster = {
    
}

export default createReducer(initialState, hamster);
