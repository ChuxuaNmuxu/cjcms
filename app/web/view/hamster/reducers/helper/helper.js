import lodash from 'lodash';
import uuid from 'uuid';
import Immutable from 'immutable'

import * as miaow from '../../Utils/miaow';
// import BlockUtils from '../../Utils/BlockUtils';
// import {defaultBlockConfig} from '../../config/config';
import ConfigManager from '../../manager/ConfigManager';
import * as entityHelper from './entity';
import * as blockHelper from './block';
import * as nodeHelper from './node';
import * as currentHelper from './current';import {extractBlockData} from '../../utils/block';

// 生成ID
export function createId (prefix='', suffix='') {
    return prefix + uuid.v4() + suffix
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
    const defaultBlockData = extractBlockData(groupConfig).set('id', id);
    return hamster.update('entities', entities => entities.set(id, defaultBlockData));
}

/**
 *  拖动一个block
 * @param {*} hamster 
 * @param {*} payload {offset, blockId}
 */
export function handleDragBlock (hamster, payload) {
    const [offset, blockIds] = miaow.destruction(payload, 'offset', 'blockIds');

    return entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: miaow.toList(blockIds),
        operations: {
            'data.props.top': miaow.add(offset.get('top')),
            'data.props.left': miaow.add(offset.get('left'))
        }
    }));
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
    const { isResistInside, operateBlockId, activatedBlockIds } = currentHelper.judgeSituation(hamster, id);
    const rightBlocks = currentHelper.getRightBlocks(hamster, activatedBlockIds, operateBlockId);
    const isActivated = currentHelper.isActivated(hamster)(operateBlockId);

    // 攘外取消叶子元素的激活
    if (!isResistInside) hamster = handleReactivateBlocks(hamster)(activatedBlockIds);
    
    /**
     * 操作符 isMultiply + isActivated 判断
     * 激活    多选    操作
     *  y       y     handleCancelActivateBlocks
     *  y       x     handleActivateBlocks
     *  x       y     handleActivateBlocks
     *  x       x     handleReactivateBlocks
     * 
    */

    let operation = handleActivateBlocks(hamster)
    if (isActivated && isMultiply) operation = handleCancelActivateBlocks(hamster)
    if (!isActivated && !isMultiply) operation = handleReactivateBlocks(hamster)

    hamster = operation(operateBlockId);

    // 操作的是节点元素，祖先元素必然处于激活状态 @version1.0 - 3
    if (nodeHelper.isLeaf(hamster)(operateBlockId)) {
        const ancestor = nodeHelper.getAncestorId(hamster)(operateBlockId);
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
export function handleResizeBlocks (hamster, blockId, direction, offset) {
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
    const angle = entity.getIn(['data', 'props', 'rotation']);

    const pinPoint = directionConfig[direction]['oppsite'];

    // 中心坐标系中偏移量
    const offsetInCCS = blockHelper.coordTransformation(miaow.destruction(offset, 'x', 'y'), angle);

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
