import {fromJS, List} from 'immutable'

import initialState from './initialState';
import Shortcut from './helper/Shortcut'
import * as helper from './helper/helper';
import * as miaow from '../utils/miaow';

function handleAddBlock (hamster, action) {
    console.log(5, action)
    const {payload: {blocks}} = action;
    const blockIds = blocks.map(block => block.get('id'));
    hamster = hamster.withMutations(hamster => {
        // 添加blocks
        hamster.updateIn(
            ['index', 'blocks'],
            blocks => blocks.concat(blockIds)
        );
        // 添加object
        hamster.update(
            'entities',
            entities => blocks.reduce(
                (acc, block) => entities.set(block.get('id'), block),
                entities
            )
        );
        // 修改current
        hamster.updateIn(
            ['current', 'blocks'],
            blocks => blocks.clear().concat(blockIds)
        )
    })
    return hamster;
}

function handleActivateBlock (hamster, action) {
    // 添加blocks
    const {payload} = action;
    // 修改current
    const handleBlockIds = payload.blockIds;
    hamster = hamster.updateIn(['current', 'blocks'], handleBlockIds)
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
    // 修改props
    return hamster.update(
        'entities',
        entities => entities.withMutations(entities => {
            payload.blocks.forEach(block => {
                entities.updateIn(
                    [block.get('id'), 'data', 'props'],
                    props => props.mergeWith(merger, payload.props)
                )
            });
        })
    )
}

function handleEntitiesChanges (hamster, action) {
    const {payload} = action;

    console.log('payload: ', payload)
    console.log('hamster: ', hamster.toJS())

    const {blockIds, operations} = payload;

    if (!blockIds) return hamster;

    return hamster.update('entities', entities => {
        return blockIds.reduce((entities, id) => {
            return operations.reduce((entities, operate, path) => {
                const objectPath = [id].concat(path.split('.'))
                return entities.updateIn(objectPath, prop => operate(prop))
            }, entities)
        }, entities);
    })
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

/**
 * 组合元素
 * @param {*} blockIds 
 */
function handleUnite (hamster, actions) {
    const blockIds = Shortcut.getActivatedBlockIds(hamster);
    // TODO: 处理嵌套的情况

    // 生成defaultObject
    const objectId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, objectId);

    // 修改children属性
    hamster = helper.handleEntitiesChanges(hamster, fromJS({
        ids: objectId,
        operations: {'data.children': miaow.add(blockIds)}
    }))

    // 加入indexs
    hamster = hamster.updateIn(['index', 'blocks'], blocks => blocks.concat(objectId));

    // 修改blocks的parents属性
    hamster = helper.handleEntitiesChanges(hamster, fromJS({
        ids: objectId,
        operations: {'data.parents': miaow.add(objectId)}
    }))

    // 重激活组合元素
    hamster = helper.handleReactivateBlocks(hamster, objectId);

    return hamster;
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

const blockType = type => 'BLOCK/' + type;

const block = {
    [blockType('ADD')]: handleAddBlock,
    [blockType('ACTIVATE')]: handleActivateBlock,
    [blockType('PROPS_CHANGE')]: handleChangeProps,
    [blockType('ENTITIES_CHANGE')]: handleEntitiesChanges,
    [blockType('CLICK')]: handleClickBlock,
    [blockType('UNITE')]: handleUnite,
}

export default createReducer(initialState.hamster, block);