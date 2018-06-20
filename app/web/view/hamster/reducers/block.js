import Immutable from 'immutable';

import initialState from './initialState';
import lodash from 'lodash';
import * as helper from './helper/helper';
import * as miaow from '../Utils/miaow';
import * as nodeHelper from './helper/node';
import * as currentHelper from './helper/current';
import * as entityHelper from './helper/entity';
import * as blockHelper from './helper/block';

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
    const {payload} = action;
    const [offset, blockId] = miaow.destruction(payload, 'offset', 'blockId');

    const {
        operateBlockId,
        isResistInside,
        activatedBlockIds
    } = currentHelper.judgeSituationWhenDrag(hamster, blockId);

    // 移动blocks
    const needMoveBlockIds = currentHelper.getRightBlocks(hamster, activatedBlockIds, operateBlockId);
    hamster = helper.handleDragBlocks(hamster, Immutable.fromJS({
        offset,
        blockIds: needMoveBlockIds
    }))

    // 更新组合元素
    hamster = helper.updateAllGroupFourDimension(hamster, needMoveBlockIds);

    // 移动的元素如果未激活，那么在移动结束后激活
    hamster = helper.activateBlock(hamster, operateBlockId, false);

    // current
    hamster = currentHelper.updateCurrent(hamster)('dragging')(false);

    return hamster;
}   

/**
 * 旋转
 * @param {*} hamster 
 * @param {*} action 
 */
function handleRotateEnd (hamster, action) {
    const {payload} = action;
    const rotateAngle = payload.get('rotateAngle')
    const blockId = payload.get('blockId');

    const { isResistInside, operateBlockId, activatedBlockIds } = currentHelper.judgeSituation(hamster, blockId);

    let rotateBlockIds = activatedBlockIds;
    // 攘外，叶子元素跟随祖先旋转
    if (!isResistInside) {
        // rotateBlockIds = activatedBlockIds.map(nodeHelper.getAllLeafIds(hamster)).concat(activatedBlockIds).flatten();
        const ancestorIds = nodeHelper.filterAncestorIds(hamster)(activatedBlockIds);

        hamster = ancestorIds.reduce((hamster, id) => {
            if (!nodeHelper.isAncestor(id)) return hamster;
            return blockHelper.leafsRotateWithAncestor(hamster)(id)(rotateAngle)
        }, hamster)
    }

    // 安内
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: rotateBlockIds,
        operations: {
            'data.props.rotation': miaow.add(rotateAngle)
        }
    }))

    // current
    hamster = currentHelper.updateCurrent(hamster)('rotating')(false);

    return hamster;
}

/**
 * 拉伸
 * @param {*} hamster 
 * @param {*} action 
 */
function handleResizeEnd (hamster, action) {
    const {payload} = action;
    const offset = payload.get('offset');
    const direction = payload.get('direction');

    const activatedIds = currentHelper.getActivatedBlockIds(hamster);
    const resizeBlockIds = activatedIds.filter(miaow.not(nodeHelper.isAncestor)(hamster));

    hamster = resizeBlockIds.reduce((hamster, id) => helper.handleResizeBlocks(hamster, id, direction, offset), hamster)

    hamster = helper.updateAllGroupFourDimension(hamster, activatedIds);

    // current
    hamster = currentHelper.updateCurrent(hamster)('resizing')(false);

    return hamster
}

// 点击元素
function handleClickBlock (hamster, action) {
    // 激活元素
    const {payload: {event={}, blockId}} = action;
    /**
     * 处理嵌套
     * @description 嵌套元素是个虚拟的元素，在被激活之后，对节点的操作将没有影响，
     * @version 1.0
     * 在未激活状态时，优先激活祖先元素；节点元素激活，祖先元素必然处于激活状态
     * 1. 非叶子节点元素，不做处理
     * 2. 祖先节点未激活，激活祖先元素
     * 3. 节点元素操作时，祖先元素必然处于激活状态
    */

    /**
     * 具体实现
     * @deprecated
     * @version 1.0
     * 1. 判断出待激活的节点
     * 2. activeIds中去除ancestorid,在不考虑ancestor的情况下处理，在结束时再补充
     * 3. 按普通激活逻辑处理
    */

    /**
     * @version 1.1
     * 1. 多选点击已激活元素，不取消激活
     * 2. 组合对内透明，对外表现为一个完整的元素
     * 	    inside：祖先元素 === 1
	 *      outside：祖先元素 > 1
     */

    /**
     * 具体实现
     * @deprecated
     * @version 1.1
     * 1. 组合元素的攘外安内：判断激活元素
     *  对外：没有叶子元素
     *  对内：只有单个祖先及其叶子元素，同vision1.0
     * 2. ctrlKey：控制操作符
     *  ctrl + 已激活: handleCancelActivateBlocks
     *  ctrl + 未激活：handleActivateBlocks
     *  没有ctrl：handleReactivateBlocks
    */
    
    /**
     * 具体实现
     * @version 1.2
     * 形式判断 -> 激活元素判断 -> 操作符判断
    */
    hamster = helper.activateBlock(hamster, blockId, event.ctrlKey);

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
    const childrenIds = currentHelper.forceMaybeAncestorsInCurrent(hamster);

    // 生成defaultGroupObject
    const entityId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, entityId);

    // 初始大小及位置
    const idCluster = currentHelper.getIdClusterInCurrent(hamster, activeblockIds);
    hamster = blockHelper.updateGroupFourDimension(hamster, idCluster, entityId);

    // 修改children属性
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: entityId,
        operations: {'data.children': miaow.replaceAs(childrenIds)}
    }))

    // 加入indexs
    // TODO: 新增block逻辑
    hamster = hamster.updateIn(['index', 'blocks'], miaow.add(entityId));
    
    // 修改blocks的parent属性
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: childrenIds,
        operations: {'data.parent': miaow.replaceAs(entityId)}
    }))

    // 删除中间节点
    // TODO: 删除元素逻辑
    hamster = hamster = hamster.updateIn(['index', 'blocks'], miaow.filter(miaow.not(nodeHelper.isMidsideNode)(hamster)))
    
    // 重激活组合元素
    hamster = helper.handleReactivateBlocks(hamster)(entityId);

    // 叶子 transform-origin
    // hamster = blockHelper.updateOriginTransformOrigin(hamster)(entityId);

    return hamster;
}

/**
 * drag or resize or rotate begin
 * @param {*} hamster 
 * @param {*} action 
 */
function handleActStart (hamster, action) {
    const {payload} = action;
    hamster = currentHelper.updateCurrent(hamster)(payload.get('type'))(true);
    return hamster;
}

function handleDeleteBlock (hamster, action) {
    const activateIds = currentHelper.getActivatedBlockIds(hamster);
    hamster = hamster.updateIn(['index', 'blocks'], miaow.minus(activateIds));
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
    [blockType('PROPS_CHANGE')]: handleChangeProps,
    [blockType('DRAG_END')]: handleDragEnd,
    [blockType('CLICK')]: handleClickBlock,
    [blockType('GROUP_UNITE')]: handleUnite,
    [blockType('ROTATE_END')]: handleRotateEnd,
    [blockType('RESIZE_END')]: handleResizeEnd,
    [blockType('BLOCK_DELETE')]: handleDeleteBlock,
    [blockType('ACT_START')]: handleActStart,
}

export default createReducer(initialState.hamster, block);