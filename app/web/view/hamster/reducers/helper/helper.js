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
        currentHelper.forceMaybeAncestors(hamster),
        nodeHelper.filterAncestorIds(hamster)
    )(ids);

    return groupIds.reduce((hamster, id) => {
        return blockHelper.updateGroupFourDimension(hamster, nodeHelper.getAllLeafIds(hamster)(id), id)
    }, hamster)
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
