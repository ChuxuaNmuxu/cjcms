import lodash, {mapKeys} from 'lodash';
import uuid from 'uuid';
import Immutable, {fromJS} from 'immutable'

import * as miaow from '../../utils/miaow';
// import BlockUtils from '../../utils/BlockUtils';
// import {defaultBlockConfig} from '../../config/config';
import ConfigManager from '../../manager/ConfigManager';
import * as entityHelper from './entity';
import * as blockHelper from './block';
import * as nodeHelper from './node';
import * as currentHelper from './current';
import * as slideHelper from './slide'
import {createBlock} from '../../utils/block';
import { ACT_DRAG, ACT_ROTATE } from './contants';

// 生成ID
export function createId (namespace='', suffix='') {
    return namespace + uuid.v4() + suffix
}

// 激活元素,已激活等于没有操作
export const handleActivateBlocks = hamster => blockIds => (
    hamster.updateIn(['current', 'blocks'], lodash.flow(miaow.add(blockIds), miaow.uniq))
)

// 取消元素激活状态
export const handleCancelActivateBlocks = hamster => blockIds => (
    hamster.updateIn(['current', 'blocks'], miaow.minus(blockIds))
)

// 重选激活的元素
export const handleReactivateBlocks = hamster => blockIds => (
    hamster.updateIn(['current', 'blocks'], lodash.flow(miaow.reset, miaow.add(blockIds), miaow.uniq))
)

// // 组合
// export function handleUniteBlocks (hamster, blockIds) {
//     blockIds = miaow.toList(blockIds);

//     return hamster;
// }

// 生成新的blockGroupObject
export function createDefaultBlockObjects (hamster, id) {
    const groupConfig = ConfigManager.getBlock('group');
    // 默认group数据，并修改ID
    const defaultBlockData = createBlock(groupConfig).set('id', id);
    return hamster.update('entities', entities => entities.set(id, defaultBlockData));
}

// 拖动blocks
export function handleDragBlocks (hamster, payload) {
    const [offset, blockIds] = miaow.destruction('offset', 'blockIds')(payload);

    return entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: miaow.toList(blockIds),
        operations: {
            'data.props.top': miaow.add(offset.get('top')),
            'data.props.left': miaow.add(offset.get('left'))
        }
    }));
}

/**
 *  拖动一个block
 * @param {*} hamster 
 * @param {*} payload {offset, blockId}
 */
export function handleDragBlock (hamster, payload) {
    payload = payload.set('blockIds', payload.get('blockId'));

    return handleDragBlocks(hamster, payload);
}

/**
 * 拖拽
 * @param {*} hamster 
 * @param {*} payload {blockId, offset: {x, y}}
 */
export function handleDrag (hamster, payload) {
    const [offset, blockId] = miaow.destruction('offset', 'blockId')(payload);
    const [left, top] = miaow.destruction('x', 'y')(offset); 

    const {blocksToOperate} = currentHelper.getSituation(hamster, blockId, ACT_DRAG)
    hamster = handleDragBlocks(hamster, Immutable.fromJS({
        offset: {top, left},
        blockIds: blocksToOperate
    }))

    // 更新组合元素
    // hamster = updateAllGroupFourDimension(hamster, blocksToOperate);

    // 更新snap数据
    hamster = slideHelper.snap(hamster);

    return hamster;
}

/**
 * 更新ids中的叶子所在树的group的四维
 * @param {*} hamster 
 * @param {*} ids 
 * @returns hamster
 */
export function updateAllGroupFourDimension (hamster, ids) {
    const groupIds = lodash.flow(
        miaow.toList,
        currentHelper.forceMaybeAncestors(hamster),
        nodeHelper.filterAncestorIds(hamster)
    )(ids);

    hamster = groupIds.reduce((hamster, id) => {
        // 叶子节点加transform-origin
        hamster = blockHelper.updateGroupFourDimension(hamster, nodeHelper.getAllLeafIds(hamster)(id), id)

        // hamster = blockHelper.updateOriginTransformOrigin(hamster)(id);

        hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
            ids: id,
            operations: {
                'data.props.rotation': miaow.replaceAs(0)
            }
        }))


        return hamster;
    }, hamster)

    return hamster;
}

/**
 * 激活元素
 * @param {*} hamster 
 * @param {*} id 
 * @param {Boolean} isMultiply 多选
 */
export function activateBlock (hamster, id, isMultiply) {
    const { isResistInside, blockOperating, blocksToOperate } = currentHelper.getSituation(hamster, id);
    // const rightBlocks = currentHelper.getRightBlocks(hamster, activatedBlockIds, operateBlockId);
    const isBlockActivated = currentHelper.isBlockActivated(hamster)(blockOperating);

    // 攘外取消叶子元素的激活
    if (!isResistInside) hamster = handleReactivateBlocks(hamster)(blocksToOperate);
    
    /**
     * 操作符 isMultiply + isBlockActivated 判断
     * 激活    多选    操作
     *  y       y     handleCancelActivateBlocks
     *  y       x     handleActivateBlocks
     *  x       y     handleActivateBlocks
     *  x       x     handleReactivateBlocks
     * 
    */

    let operation = handleActivateBlocks(hamster)
    if (isBlockActivated && isMultiply) operation = handleCancelActivateBlocks(hamster)
    if (!isBlockActivated && !isMultiply) operation = handleReactivateBlocks(hamster)

    hamster = operation(blockOperating);

    // 操作的是节点元素，祖先元素必然处于激活状态 @version1.0 - 3
    if (nodeHelper.isLeaf(hamster)(blockOperating)) {
        const ancestor = nodeHelper.getAncestorId(hamster)(blockOperating);
        return handleActivateBlocks(hamster)(ancestor);
    }

    return hamster;
}

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
/**
 * 拉伸
 * @version 1.2
 * @param {*} hamster 
 * @param {*} blockId
 * @param {Map} offset {x, y}
 * @returns hamster
 */
export function handleResizeBlocks (hamster, blockId, direction='e', offset) {
    /**
     * 具体实现
     * @version 1.2
     * 说明：普通坐标系（OCS）：以左上角为原点，默认坐标系；
     * 中心坐标系（CCS）： 以block中心为原点，旋转后的坐标系
     * pinpoint：操作前和操作后不变的点
     *  1. 普通坐标系中的偏移换算到中心坐标系偏移量sv，这一步换算可以实现指哪打哪
     *  2. 在普通坐标系中以block中心以sv为宽高偏移量拉伸block；
     *  3. (旋转)；
     *  4. 在中心坐标系中计算距离到达最终状态当前pinpoint的偏移向量pv
     *  5. pv换算到普通坐标系，在普通坐标系偏移block使pinpoint重合
     * 总的来说：在中心坐标系中计算，在普通坐标系中操作；先计算width，height，再以中心旋转，最后修正top, left
     */
    const entity = entityHelper.getEntity(hamster)(blockId);
    const angle = entity.getIn(['data', 'props', 'rotation']) || 0;

    const pinPoint = directionConfig[direction]['oppsite'];

    // 中心坐标系中偏移量
    const offsetInCCS = blockHelper.coordTransformation(miaow.destruction('x', 'y')(offset), angle);

    const sizeOffsetVector = lodash.zip(
        offsetInCCS,
        directionConfig[direction]['emendation']
    ).map(x => lodash.multiply.apply(null, x))
    
    const sizeOffset = {
        width: sizeOffsetVector[0],
        height: sizeOffsetVector[1]
    }

    const oldFourDimension = blockHelper.getPackageFourDimension(hamster, miaow.toList(blockId));

    // pin住中心点坐标, 增加width, height
    const fourDimensionPinnedCenter = blockHelper.pin([0.5, 0.5])(sizeOffset)(oldFourDimension);
    hamster = blockHelper.updateBlockFourDimension(hamster, blockId, Immutable.fromJS(fourDimensionPinnedCenter));

    const newFourDimension = blockHelper.getPackageFourDimension(hamster, miaow.toList(blockId));

    // 距离到达最终状态当前pinpoint的偏移向量
    const positionOffset = blockHelper.samePointDifferenceVector(oldFourDimension)(newFourDimension)(pinPoint);

    // 换算到普通坐标系
    const positionOffsetTransform = blockHelper.coordTransformation(positionOffset, -angle);

    const fourDimensionPinnedPoint = {
        ...fourDimensionPinnedCenter,
        left: fourDimensionPinnedCenter.left - positionOffsetTransform[0],
        top: fourDimensionPinnedCenter.top - positionOffsetTransform[1]
    }

    hamster = blockHelper.updateBlockFourDimension(hamster, blockId, Immutable.fromJS(fourDimensionPinnedPoint));

    return hamster;
}

/**
 * 拉伸
 * @param {*} hamster 
 * @param {*} payload {offset, direction}
 */
export const handleResize = (hamster, payload) => {
    const offset = payload.get('offset');
    const direction = payload.get('direction');

    const activatedIds = currentHelper.getActivatedBlockIds(hamster);
    const resizeBlockIds = activatedIds.filter(miaow.not(nodeHelper.isAncestor)(hamster));

    hamster = resizeBlockIds.reduce((hamster, id) => handleResizeBlocks(hamster, id, direction, offset), hamster)

    // hamster = updateAllGroupFourDimension(hamster, activatedIds);

    return hamster;
}

/**
 * 旋转
 * @param {*} hamster 
 * @param {*} blockIds 
 * @param {*} angle 
 */
export const handleRotateBlocks = (hamster, blockIds, angle) => {
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: miaow.toList(blockIds),
        operations: {
            'data.props.rotation': miaow.add(angle)
        }
    }))
    return hamster;
}

/**
 * 
 * @param {*} hamster 
 * @param {*} payload {blockId, rotateAngle}
 */
export const handleRotate = (hamster, payload) => {
    const rotateAngle = payload.get('rotateAngle')
    const blockId = payload.get('blockId');

    const { isResistInside, blocksToOperate } = currentHelper.getSituation(hamster, blockId, ACT_ROTATE);

    let rotateBlockIds = blocksToOperate;
    // 攘外，叶子元素跟随祖先旋转
    if (!isResistInside) {
        // rotateBlockIds = activatedBlockIds.map(nodeHelper.getAllLeafIds(hamster)).concat(activatedBlockIds).flatten();
        const ancestorIds = nodeHelper.filterAncestorIds(hamster)(blocksToOperate);

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
    return hamster;
}

/**
 * 新增block
 * @param {*} hamster 
 * @param {*} blocks 
 */
export const handleAddBlock = (hamster, blocks) => {
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
                (acc, block) => acc.set(block.get('id'), block),
                entities
            )
        );
        // 修改current
        hamster.updateIn(
            ['current', 'blocks'],
            blocks => blocks.clear().concat(blockIds)
        )
    })

    const operatingSlideId = currentHelper.getOperatingSlideId(hamster);
    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: operatingSlideId,
        operations: {
            'data.blocks': miaow.add(blockIds)
        }
    }))

    return hamster
}

/**
 * 创建action名带命名空间的handler映射表
 * @param {*} namespace 
 */
const createHandlers = namespace => handlers => (
    namespace ? mapKeys(handlers, (value, type) => `${namespace}/${type}`) : handlers
)

/**
 * reducer生成函数，减少样板代码
 * @param {*} initialState 
 * @param {*} handlers 
 * @param {*} namespace action的前缀，方便区分
 */
const createReducer = (initialState, handlers, namespace = '') => {
    handlers = createHandlers(namespace)(handlers);
    return (state, action) => {
        state = state ? (state.toJS ? state : fromJS(state)) : fromJS(initialState)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

export {
    createReducer // reducer生成函数，减少样板代码
}
