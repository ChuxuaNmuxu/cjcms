import * as nodeHelper from './node';
import lodash from 'lodash';
import * as miaow from '../../Utils/miaow';

/**
 * current数组中可能包含祖先节点，独立节点和叶子节点
*/

export const getActivatedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}

/**
 * 孤立节点+祖先节点
 */
export function getExceptLeafs (hamster, ids) {
    const ancestorIds = miaow.toList(ids).map(lodash.curry(nodeHelper.getMaybeAncestorId)(hamster));

    return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
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
export const getExceptLeafsInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);

    return getExceptLeafs(hamster, activatedIds);
}

/**
 * 获取激活元素中的祖先元素
 */
export const getAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);

    const ancestorIds = activatedIds.map(lodash.curry(nodeHelper.getAncestorId)(hamster));

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

    const allLeafBlockIds = ancestorBlockIds.map(lodash.curry(nodeHelper.getAllLeafIds)(hamster)).flatten();

    return miaow.uniq(miaow.cat(orphanIds, allLeafBlockIds))
}

/**
 * 攘外
 * @description 组合对内透明，对外表现为一个完整的元素
 *  对外：被激活元素中已有非点击元素的祖先元素
 * @param {*} ids 
 */
export function resistOutside (hamster, ids) {
    const blockIds = getExceptLeafs(hamster, ids);

    return ids.size ===1 || blockIds.size > 1
}

/**
 * 已激活
 * @param {*} hamster 
 * @param {*} id 
 */
export function isActivated (hamster, id) {
    const activatedIds = getActivatedBlockIds(hamster);
    return activatedIds.includes(id)
}
