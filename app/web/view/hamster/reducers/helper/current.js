import * as nodeHelper from './node';
import lodash from 'lodash';
import * as miaow from '../../utils/miaow';
import { getEntity } from './entity';

/**
 * current数组中可能包含祖先节点，独立节点和叶子节点
*/

export const getActivatedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}

/**
 * 转换为孤立节点+祖先节点，没有重复id
 * @returns {Array}
 */
export function forceMaybeAncestors (hamster) {
    return ids => {
        const ancestorIds = miaow.toList(ids).map(lodash.curry(nodeHelper.getMaybeAncestorId)(hamster));
    
        return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
    }
}

/**
 * 获取一组id中的祖先元素
 * @description 不包括孤立节点
 */
// export function getAncestors (hamster, ids) {
//     const ancestorIds = miaow.toList(ids).map(lodash.curry(nodeHelper.getAncestorId)(hamster));

//     return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
// }

/**
 * 获取激活元素中出叶子节点之外的节点
 * @description 即孤立节点+祖先节点
 */
export const forceMaybeAncestorsInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);

    return forceMaybeAncestors(hamster)(activatedIds);
}

/**
 * 获取激活元素中的祖先元素
 * @returns {Array}
 */
export const getActivatedSlideIds = (hamster) => {
    return hamster.getIn(['current', 'slides'])
}

export const getActivatedSlideGroupId = (hamster) => {
    return hamster.getIn(['current', 'slide.group'])
}

// 获取激活元素中的祖先元素
export const getAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);

    const ancestorIds = activatedIds.map(nodeHelper.getAncestorId(hamster));

    return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
}

// // 在激活元素中去除祖先元素
// export const removeAncestorInCurrent = (hamster) => {
//     const activatedIds = getActivatedBlockIds(hamster);
//     const ancestorIds = getAncestorInCurrent(hamster);

//     return miaow.getComplement(activatedIds, ancestorIds);
// }

// 获取激活元素中的孤立元素
export function getOrphansInCurrent (hamster) {
    const activatedIds = getActivatedBlockIds(hamster);
    return activatedIds.filter(nodeHelper.isOrphan(hamster))
}

/**
 * 获取节点群组
 * @description 在激活的节点中找到孤立节点 + 祖先节点之下的所有叶子节点
 * @param {*} hamster 
 */
export function getIdClusterInCurrent (hamster, ids) {
    ids = miaow.toList(ids);
    // const orphanIdsInCurrent = getOrphansInCurrent(hamster);
    // const ancestorBlockIds = getAncestorInCurrent(hamster);

    const orphanIds = miaow.filter(nodeHelper.isOrphan(hamster))(ids);
    const ancestorBlockIds = miaow.filter(nodeHelper.isAncestor(hamster))(ids);

    const allLeafBlockIds = ancestorBlockIds.map(nodeHelper.getAllLeafIds(hamster)).flatten();

    return miaow.uniq(miaow.cat(orphanIds, allLeafBlockIds))
}

/**
 * 安内
 * 安内没有祖先元素
 * @description 当前操作的是叶子元素，当前被激活祖先元素属于且只属于被操作元素的
 * @param {*} hamster 
 * @param {} id 当前操作的元素id
 * @returns {Boolean}
 */
export const isResistInside = hamster => id => {
    const activatedBlockId = getActivatedBlockIds(hamster);

    if (nodeHelper.isLeaf(hamster)(id)) {
        const operatingBlockAncestor = nodeHelper.getAncestorId(hamster)(id);
        const ancestorOfActivatedBlocks = forceMaybeAncestorsInCurrent(hamster);

        return ancestorOfActivatedBlocks.size === 1 && ancestorOfActivatedBlocks.includes(operatingBlockAncestor);
    }
    return false;
}

/**
 * 攘外
 * 攘外没有叶子
 * @description 组合对内透明，对外表现为一个完整的元素
 * @param {*} hamster 
 * @param {*} id 当前操作元素
 * @returns {Boolean}
 */
export const isResistOutside = miaow.not(isResistInside);

/**
 * drag的对内和点击有点不同：在对内情况下，且至少有一个叶子元素被激活
 * @returns {Boolean}
*/
export const isResistInsideWhenDrag = hamster => id => miaow.prevCheck(
    isResistInside(hamster)
)(
  id => nodeHelper.includesLeafs(hamster)(getActivatedBlockIds(hamster))
)(id)

// drag的对外
export const isResistOutsideWhenDrag = miaow.not(isResistInsideWhenDrag);

/**
 * 形势判断
 * @param {*} hamster 
 * @param {*} operateBlockId 被操作的Id
 * @param {*} option isResistInside: 判断对内的方法
 * @returns {plainObject} {
 *      isResistInside,
 *      operateBlockId,
 *      activatedBlockIds
 * } : {
 *      {Boolean} 
 *      {String} 正在被操作的blockId
 *      {List} 将被操作的blockId
 * }
 */
export function judgeSituation (hamster, operateBlockId, option={isResistInside}) {
    let activatedBlockIds = getActivatedBlockIds(hamster);

    const isResistInside = option.isResistInside(hamster)(operateBlockId);

    // 安内没有祖先
    if (isResistInside) {
        activatedBlockIds = nodeHelper.filterLeafIds(hamster)(activatedBlockIds)
    } else {
        // 攘外没有叶子
        operateBlockId = forceMaybeAncestors(hamster)(operateBlockId).get(0);
        activatedBlockIds = forceMaybeAncestors(hamster)(activatedBlockIds);
    }

    return {
        operateBlockId,
        isResistInside,
        activatedBlockIds
    }
}

/**
 * drag时的形势判断
 * @param {*} hamster
 * @param {*} operateBlockId 被操作的Id
 * @returns {plainObject} {
 *      isResistInside,
 *      operateBlockId,
 *      activatedBlockIds
 * } : {
 *      {Boolean} 
 *      {String} 正在被操作的blockId
 *      {List} 将被操作的blockId
 * }
 */
export function judgeSituationWhenDrag (hamster, operateBlockId) {
    return judgeSituation(hamster, operateBlockId, {isResistInside: isResistInsideWhenDrag})
}

/**
 * 将被操作的正确block
 * @param {*} hamster 
 * @param {*} operateBlockId 当前操作的blockId 
 * @description 对外：没有叶子节点；对内：只是叶子节点
 * @returns {Array} 全是叶子节点或者没有叶子节点
 */
export function getRightBlocks (hamster, activatedBlockId, operateBlockId) {
    // 被操作元素已激活，选中所有激活元素；未激活则选中自己
    const rightBlocksByActivate = miaow.dispatchMission(
        miaow.prevCheck(isBlockActivated(hamster))(
            miaow.always(activatedBlockId)
        ),
        miaow.toList
    )(operateBlockId)

    // 将祖先元素替换为所有叶子元素
    const groupBlocks = lodash.flow(
        miaow.map(
            miaow.dispatchMission(
                miaow.prevCheck(nodeHelper.isAncestor(hamster))(nodeHelper.getAllLeafIds(hamster)),
                miaow.identity,
            )
        ),
        miaow.handle('flatten')
    )(rightBlocksByActivate)

    return groupBlocks
}

/**
 * 将被drag的正确block
 * @param {*} hamster 
 * @param {*} id 当前操作的blockId 
 * @returns {Array}
 */
export function getBlockToDrag (hamster, id) {
}

/**
 * 将被resize的正确block
 * @param {*} hamster 
 * @description 去掉祖先节点
 */
// export const rightBlockToResize = hamster => lodash.flow(
//     getRightBlock,
//     miaow.filter(miaow.not(nodeHelper.isAncestor)(hamster)),
// )(hamster)

/**
 * 将被rotate的正确block
 * @param {*} hamster 
 * @description 祖先节点->整棵树
 */
// export const rightBlockToRotate = rightBlockToDrag;



/**
 * 已激活
 * @param {*} hamster 
 * @param {*} id 
 */
export function isBlockActivated (hamster) {
    return id => {
        const activatedIds = getActivatedBlockIds(hamster);
        return activatedIds.includes(id)
    }
}

/**
 * 设置current属性的值
 * @param {*} hamster 
 * @param {*} path 路径 
 * @param {*} operation
 */
export const updateCurrent = hamster => (path = '') => operation => {
    // operation = lodash.isFunction(operation) ? operation : miaow.replaceAs(operation);
    const currentPath = ['current'].concat(path.split('.'))

    return hamster.getIn(currentPath)
    ? hamster.updateIn(currentPath, lodash.isFunction(operation) ? operation : miaow.replaceAs(operation))
    : hamster.setIn(currentPath, operation)
}

export const isDragging = hamster => hamster.getIn(['current', 'dragging']);
export const isResizing = hamster => hamster.getIn(['current', 'resizing']);
export const isRotating = hamster => hamster.getIn(['current', 'rotating']);

// 正在操作的blockId
export const getOperatingBlockId = hamster => hamster.getIn(['current', 'operatingBlockId']);

export const getOperatingSlideId = hamster => hamster.getIn(['current', 'operatingSlideId'])

/**
 * 获取当前操作的slide中的所有blockIds
 * @param {*} hamster
 */
export const getAllBlockIdsInOperatingSlide = hamster => {
    return lodash.flow(
        getOperatingSlideId,
        getEntity(hamster),
        miaow.get('data.blocks')
    )(hamster)
}
