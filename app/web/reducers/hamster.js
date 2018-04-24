import {fromJS, List} from 'immutable';

import initialState from './initialState';

function handleAddBlock (hamster, action) {
    const {payload} = action;
    const blockIds = payload.blocks.map(block => block.get('id'));
    // 添加blocks
    hamster = hamster.updateIn(['index', 'blocks'], blocks => blocks.concat(blockIds));
    // 添加object
    hamster = hamster.update('objects', objects => payload.blocks.reduce((acc, block) => objects.set(block.get('id'), block), objects));
    // 修改current
    hamster = hamster.updateIn(['current', 'blocks'], blocks => blocks.clear().concat(blockIds))
    return hamster;
}

function handleActivateBlock (hamster, action) {
    // 添加blocks
    const {payload} = action;
    // 修改current
    const blockIds = List(payload.blockIds);
    hamster = hamster.updateIn(['current', 'blocks'], blocks => blocks.clear().concat(blockIds))
    return hamster;
}

const merger = (a, b) => {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(merger, b)
    }
    return b
}

function handleChangeProps (hamster, action) {
    const {payload} = action;
    const id = payload.block.get('id');
    // 修改props
    return hamster.updateIn(
        ['objects', id, 'data', 'props'],
        props => props.mergeWith(merger, payload.props)
    )
}

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
    BLOCK_ADD: handleAddBlock,
    BLOCK_ACTIVATE: handleActivateBlock,
    BLOCK_PROPS_CHANGE: handleChangeProps
}

export default createReducer(initialState, hamster);
