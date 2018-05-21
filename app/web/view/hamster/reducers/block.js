import {fromJS, List} from 'immutable'

import initialState from './initialState';
import Shortcut from './helper/Shortcut'
import * as helper from './helper/helper';
import * as miaow from '../Utils/miaow';
import * as nodeHelper from './helper/node';

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
            'objects',
            objects => blocks.reduce(
                (acc, block) => objects.set(block.get('id'), block),
                objects
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
        'objects',
        objects => objects.withMutations(objects => {
            payload.blocks.forEach(block => {
                objects.updateIn(
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

    return hamster.update('objects', objects => {
        return blockIds.reduce((objects, id) => {
            return operations.reduce((objects, operate, path) => {
                const objectPath = [id].concat(path.split('.'))
                return objects.updateIn(objectPath, prop => operate(prop))
            }, objects)
        }, objects);
    })
}

// 点击元素
function handleClickBlock (hamster, action) {
    // 激活元素
    const {payload: {event={}, blockId}} = action;
    /**
     * TODO: 处理嵌套
     * 1. 非叶子节点元素，不做处理
     * 2. 嵌套树的所有节点没有被激活元素，激活祖先元素
     * 3. 嵌套树的所有节点中有被激活元素，激活节点元素
    */
    if (nodeHelper.getChildrendIds(hamster, blockId).size) return hamster;

    // const leafBlocks = nodeHelper.getLeafNodes();

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
 */
function handleUnite (hamster, actions) {
    const activeblockIds = Shortcut.getActivatedBlockIds(hamster);
    // TODO: 处理嵌套的情况

    // 生成defaultObject
    const objectId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, objectId);

    // 修改children属性
    hamster = helper.handleEntitiesChanges(hamster, fromJS({
        ids: objectId,
        operations: {'data.children': miaow.add(activeblockIds)}
    }))

    // 加入indexs
    hamster = hamster.updateIn(['index', 'blocks'], miaow.add(objectId));

    // 修改blocks的parents属性
    hamster = helper.handleEntitiesChanges(hamster, fromJS({
        ids: activeblockIds,
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
    [blockType('GROUP_UNITE')]: handleUnite,
}

export default createReducer(initialState.hamster, block);