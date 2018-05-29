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
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: needMoveBlockIds,
        operations: {
            'data.props.top': miaow.add(offset.get('top')),
            'data.props.left': miaow.add(offset.get('left'))
        }
    }));
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
    // const blockId = payload.get('blockId');
    // const rotateRadius = payload.get('rotateRadius');

    // const blockCenterClientOffset = blockHelper.getBlockCenter(hamster, blockId)

    // const rotateRadian = Math.atan(left / rotateRadius - top);
    // const rotateAngle = rotateRadian / Math.PI * 180;

    // TODO: GROUP
    const applyBlockIds = currentHelper.getActivatedBlockIds(hamster);
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: applyBlockIds,
        operations: {
            'data.props.rotation': miaow.replaceAs(rotateAngle)
        }
    }))

    return hamster;
}

/**
 * 拉伸
 * @param {*} hamster 
 * @param {*} action 
 */
const directionConfig = {
    'nw': {
        oppsite: 'se',
        emendation: [-1, -1]
    },
    'sw': {
        oppsite: 'ne',
        emendation: [-1, 1]
    },
    'ne': {
        oppsite: 'sw',
        emendation: [1, -1]
    },
    'se': {
        oppsite: 'nw',
        emendation: [1, 1]
    },
    'e': {
        oppsite: 'w',
        emendation: [1, 0]
    },
    'n': {
        oppsite: 's',
        emendation: [0, -1]
    },
    's': {
        oppsite: 'n',
        emendation: [0, 1]
    },
    'w': {
        oppsite: 'e',
        emendation: [-1, 0]
    }
}

function handleResizeEnd (hamster, action) {
    const {payload} = action;
    const offset = payload.get('offset');
    const direction = payload.get('direction');

    const pinPoint = directionConfig[direction]['oppsite'];

    const sizeOffsetArray = lodash.zip(
        miaow.destruction(offset, 'x', 'y'),
        directionConfig[direction]['emendation']
    ).map(x => lodash.multiply.apply(null, x))
    
    const sizeOffset = {
        x: sizeOffsetArray[0],
        y:sizeOffsetArray[1]
    }

    const activatedIds = currentHelper.getActivatedBlockIds(hamster);

    hamster = activatedIds.reduce((hamster, id) => {
        const fourDimension = lodash.flow(
            blockHelper.getPackageFourDimension,
            lodash.curryRight(blockHelper.pin)(pinPoint)(sizeOffset),
        )(hamster, miaow.toList(id))

        return blockHelper.updateBlockFourDimension(hamster, id, Immutable.fromJS(fourDimension));
    }, hamster)

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
     * 3. 节点元素激活，祖先元素必然处于激活状态
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
     * @version 1.1
     * 1. 组合元素的攘外安内：判断激活元素
     *  对外：没有叶子元素
     *  对内：只有单个祖先及其叶子元素，同vision1.0
     * 2. ctrlKey：控制操作符
     *  ctrl + 已激活: handleCancelActivateBlocks
     *  ctrl + 未激活：handleActivateBlocks
     *  没有ctrl：handleReactivateBlocks
    */
    
   const activeIds = currentHelper.getActivatedBlockIds(hamster);

   // 祖先节点元素，不做处理 @version 1.0 - 1
   if (nodeHelper.isAncestor(hamster, blockId)) return hamster;

    // 激活元素 @version 1.1 - 1 @version 1.0 - 2
    const isResistOutside = currentHelper.resistOutside(hamster, activeIds.concat(blockId));
    let toAcitivateId = blockId;

    const ancestorsInCurrent = currentHelper.getAncestorInCurrent(hamster);
    if (isResistOutside) {
        // 去除叶子元素,只保留祖先元素
        hamster = helper.handleReactivateBlocks(hamster, ancestorsInCurrent);
        // 同时如果点击的是叶子元素，则待激活元素为祖先元素
        if (nodeHelper.isInTree(hamster, toAcitivateId)) toAcitivateId = nodeHelper.getAncestorId(hamster, blockId)
    }

    // 操作符 @version 1.1 - 2
    // 没有ctrl
    let operation = lodash.curryRight(helper.handleReactivateBlocks)(toAcitivateId)
    if (event.ctrlKey) {
        // ctrl + 未激活
        operation = lodash.curryRight(helper.handleActivateBlocks)(toAcitivateId)

        // ctrl + 已激活
        if (currentHelper.isActivated(hamster, toAcitivateId)) {
            operation = lodash.curryRight(helper.handleCancelActivateBlocks)(toAcitivateId)
        }
    }

    hamster = operation(hamster);
    
    // 保证ancestorId被激活 @version1.0 - 3
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
    const orphanIdsInCurrent = currentHelper.getOrphansInCurrent(hamster);

    const childrenIds = miaow.cat(ancestorIdsInCurrent, orphanIdsInCurrent);

    // 生成defaultGroupObject
    const entityId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, entityId);

    // 初始大小及位置
    const idCluster = currentHelper.getIdClusterInCurrent(hamster);
    const packageFourDimension = blockHelper.getPackageFourDimension(hamster, idCluster);
    hamster = blockHelper.updateBlockFourDimension(hamster, entityId, Immutable.fromJS(packageFourDimension));

    // 扩大一点,留点间隙
    hamster = blockHelper.stretchBlock(hamster, entityId, 5);

    // 修改children属性
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: entityId,
        operations: {'data.children': miaow.replaceAs(childrenIds)}
    }))

    // 加入indexs
    hamster = hamster.updateIn(['index', 'blocks'], miaow.add(entityId));

    // 修改blocks的parent属性
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: childrenIds,
        operations: {'data.parent': miaow.replaceAs(entityId)}
    }))

    // 重激活组合元素
    hamster = helper.handleReactivateBlocks(hamster, entityId);

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
}

export default createReducer(initialState.hamster, block);