import Immutable from 'immutable';

import initialState from './initialState';
import lodash from 'lodash';
import * as helper from './helper/helper';
import * as miaow from '../Utils/miaow';
import * as nodeHelper from './helper/node';
import * as currentHelper from './helper/current'

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
    if (a && a.mergeWith && !Immutable.List.isList(a) && !Immutable.List.isList(b)) {
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

/**
 * 拖拽结束
 * @param {*} hamster 
 * @param {*} action 
 */
function handleDragEnd (hamster, action) {
    const {payload: offset} = action;

    /**
     * 待移动的blockId
     * @description 激活节点数组中包含祖先节点，独立节点和叶子节点，只需要将未选中的叶子节点包含进来即可
     */
    const activatedBlockIds = currentHelper.getActivatedBlockIds(hamster);
    const ancestorBlockIds = currentHelper.getAncestorInCurrent(hamster);
    const allLeafBlockIds = ancestorBlockIds.map(lodash.curry(nodeHelper.getAllLeafIds)(hamster)).flatten();

    const needMoveBlockIds = miaow.uniq(miaow.cat(activatedBlockIds, allLeafBlockIds))

    // 移动block
    hamster = helper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: needMoveBlockIds,
        operations: {
            'data.props.top': miaow.add(offset.get('top')),
            'data.props.left': miaow.add(offset.get('left'))
        }
    }));
    return hamster;
}

// 点击元素
function handleClickBlock (hamster, action) {
    // 激活元素
    const {payload: {event={}, blockId}} = action;
    /**
     * 处理嵌套
     * @description 嵌套元素是个虚拟的元素，在被激活之后，对节点的操作将没有影响，
     * 在未激活状态时，优先激活祖先元素；节点元素激活，祖先元素必然处于激活状态
     * 1. 非叶子节点元素，不做处理
     * 2. 祖先节点未激活，激活祖先元素
     * 3. 节点元素激活，祖先元素必然处于激活状态
     * 4. ctrl点击，只有自己和祖先节点处于激活状态时，不取消激活
    */
    const activeIds = currentHelper.getActivatedBlockIds(hamster);

    /**
     * 具体实现
     * 1. 判断出待激活的节点
     * 2. activeIds中去除ancestorid,在不考虑ancestor的情况下处理，在结束时再补充
     * 3. 按普通激活逻辑处理
    */
    let toAcitivateId = blockId;
    let realActiveIds = Immutable.List();

    if (nodeHelper.isInTree(hamster, blockId)) {
        if (!nodeHelper.isLeaf(hamster, blockId)) return hamster;

        const ancestorId = nodeHelper.getAncestorId(hamster, blockId);
        if (!activeIds.includes(ancestorId)) toAcitivateId = ancestorId;

        realActiveIds = activeIds.filter(id => id !== ancestorId);
    }

    // 激活节点
    // TODO: 优化为不直接return，而是给hamster赋值
    if (event.ctrlKey) {
        if (realActiveIds.includes(toAcitivateId)) {
            if (realActiveIds.size === 1) return hamster;
            return helper.handleCancelActivateBlocks(hamster, toAcitivateId)
        }
        return helper.handleActivateBlocks(hamster, toAcitivateId);
    };
    hamster = helper.handleReactivateBlocks(hamster, toAcitivateId);

    // 保证ancestorId被激活
    const ancestor = nodeHelper.getAncestorId(hamster, toAcitivateId);
    if (ancestor) return helper.handleActivateBlocks(hamster, ancestor);

    return hamster; 
}

/**
 * 组合元素
 */
function handleUnite (hamster, actions) {
    const activeblockIds = currentHelper.getActivatedBlockIds(hamster);
    /**
     * 处理嵌套的情况
     * 1. 嵌套取祖先元素
    */
    // 孤立节点与祖先节点
    const ancestorIdsInCurrent = currentHelper.getAncestorInCurrent(hamster);
    // TODO: 有必要的话可以抽取出来
    const orphanIdsInCurrent = activeblockIds.filter(id => nodeHelper.isOrphan(hamster, id));

    const childrenIds = miaow.cat(ancestorIdsInCurrent, orphanIdsInCurrent);

    // 生成defaultGroupObject
    const objectId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, objectId);

    // 修改children属性
    hamster = helper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: objectId,
        operations: {'data.children': miaow.replaceAs(childrenIds)}
    }))

    // 加入indexs
    hamster = hamster.updateIn(['index', 'blocks'], miaow.add(objectId));

    // 修改blocks的parent属性
    hamster = helper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: childrenIds,
        operations: {'data.parent': miaow.replaceAs(objectId)}
    }))

    // 重激活组合元素
    hamster = helper.handleReactivateBlocks(hamster, objectId);

    return hamster;
}

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : Immutable.fromJS(state)) : Immutable.fromJS(initialState)
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
    // [blockType('ENTITIES_CHANGE')]: handleEntitiesChanges,
    [blockType('DRAG_END')]: handleDragEnd,
    [blockType('CLICK')]: handleClickBlock,
    [blockType('GROUP_UNITE')]: handleUnite,
}

export default createReducer(initialState.hamster, block);