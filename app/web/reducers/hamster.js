import {fromJS, List} from 'immutable';
import lodash from 'lodash'

import initialState from './initialState';
import * as miaow from '../view/hamster/Utils/miaow';
import * as helper from './helper/helper';
import Shortcut from './helper/Shortcut';

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

// 点击元素
function handleClickBlock (hamster, action) {
    // 激活元素
    const {payload: {event={}, blockId}} = action;
    const activeIds = Shortcut.getActivatedBlockIds(hamster);

    if (event.ctrlKey) {
        if (activeIds.includes(blockId)) {
            if (activeIds.size === 1) return hamster;
            return helper.handleCancelActivateBlocks(hamster, blockId)
        }
        return helper.handleActivateBlock(hamster, blockId)
    };
    return helper.handleReactivateBlocks(hamster, blockId);
}

const merger = (a, b) => {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(merger, b)
    }
    return b
}

function handleChangeProps (hamster, action) {
    const {payload} = action;
    // 修改props
    return hamster.update('objects', objects => objects.withMutations(objects => {
            payload.blocks.forEach(block => {
                objects.updateIn(
                    [block.get('id'), 'data', 'props'],
                    props => props.mergeWith(merger, payload.props)
                )
            });
        })
    )
}

/**
 * objects数据增删改
 * @param {*} hamster 
 * @param {*} param1 
 */
function handleEntitiesChanges (hamster, actions) {
    const {blockIds, operations={}} = actions.payload;
    if (!blockIds) return hamster;

    return hamster.update('objects', objects => {
        return blockIds.reduce((objects, id) => {
            return operations.reduce((objects, operate, path) => {
                const objectPath = [id].concat(path.split('.'))
                return objects.updateIn(objectPath, prop => operate(prop))
            }, objects)
        }, objects);
    })
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
    // BLOCK_ACTIVATE: handleActivateBlock,
    BLOCK_PROPS_CHANGE: handleChangeProps,
    ENTITIES_PROPS_CHANGE: handleEntitiesChanges,
    BLOCK_CLICK: handleClickBlock
}

export default createReducer(initialState, hamster);
