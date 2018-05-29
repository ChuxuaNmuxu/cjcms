import Immutbale from 'immutable';

import * as miaow from '../../Utils/miaow';
import * as entityHelper from './entity';
import lodash from 'lodash'

/**
 * 节点数组存在
 * @param {Array} ids 
 */
function nodesExist (ids) {
    return ids && ids.size
}

/**
 * 获取子节点
 * @param {*} hamster 
 * @param {*} id 
 * @returns list
 */
export function getChildrenIds (hamster, id) {
    const entity = entityHelper.getEntity(hamster, id); 
    if (!entity) return Immutbale.List();
    return entity.getIn(['data', 'children']);
}

/**
 * 获取元素的父节点id
 * @param {*} hamster 
 * @param {*} id
 * @returns undefined | String 
 */
export function getParentId (hamster, id) {
    const entity = entityHelper.getEntity(hamster, id);
    return entity && entity.getIn(['data', 'parent']);
}

/**
 * 有子节点
 * @param {*} hamster 
 * @param {*} id 
 */
export function hasChildrenIds (hamster, id) {
    return getChildrenIds(hamster, id).size > 0
}

/**
 * 有父节点
 * @param {*} hamster 
 * @param {*} id 
 */
export function hasParentId (hamster, id) {
    return Boolean(getParentId(hamster, id))
}

/**
 * 是否在一个节点树中
 * @description 父子节点至少得有一个
 * @param {*} hamster 
 * @param {*} id 
 */
export const isInTree = miaow.or(
    hasChildrenIds,
    hasParentId
)

/**
 * 是祖先节点
 * @description 有子节点,没有父节点
 */
export const isAncestor = miaow.and(
    hasChildrenIds,
    miaow.not(hasParentId)
)

/**
 * 是叶子节点
 * @description 没有子节点,有父节点
 * @param {*} hamster 
 * @param {*} id
 */
export const isLeaf = miaow.and(
    hasParentId,
    miaow.not(hasChildrenIds)
)

/**
 * 是中间节点
 * @description 既有子节点又有父节点
 * @param {*} hamster 
 * @param {*} id
 */
export const isMidsideNode = miaow.and(
    hasChildrenIds,
    hasParentId
)

/**
 * 孤立节点
 * @description 不在节点树中
 * @param {*} hamster 
 * @param {*} id 
 */
export const isOrphan = miaow.not(isInTree)

/**
 * 获取元素的祖先节点id
 * @param {*} hamster 
 * @param {*} id 
 */
// 无祖先返回当前节点
export const getMaybeAncestorId = (hamster, id) => {
    const parentId = getParentId(hamster, id);
    if (!parentId) return id;
    return getMaybeAncestorId(hamster, parentId)
}
// 无祖先节点返回undefined
export function getAncestorId (hamster, id) {
    const maybeAncestorId = getMaybeAncestorId(hamster, id);
    if (isAncestor(hamster, maybeAncestorId)) return maybeAncestorId;
}

/**
 * 获取某节点下的所有叶子节点id
 * @param {*} hamster 
 * @param {*} id 单个id或id数组
 * @param {*} seen 累加器，主要作用是为记录回调的结果，一般使用不需要传值；传值则为初始的叶子节点数组
 */
// 没有children时会返回包含自己的数组
export function getMaybeLeafIds (hamster, id, seen) {
    seen = seen || Immutbale.List();
    const ids = miaow.toList(id);

    if (!ids.size) return seen;

    const head = ids.first();
    const rest = ids.delete(0);

    const children = getChildrenIds(hamster, head);

    // 满足条件，seen累加id(head)，消耗ids的size
    if (!nodesExist(children)) return getMaybeLeafIds(hamster, rest, miaow.cat(seen, head));
    // 否则，children和余下的id都满足可能产生叶子节点
    return getMaybeLeafIds(hamster, miaow.cat(rest, children), seen);
}
// 没有children返回空数组
export function getLeafIds (hamster, id) {
    const ids = miaow.toList(id);
    const leafs = getMaybeLeafIds(hamster, ids);
    return leafs.filter(id => isLeaf(hamster, id));
}

/**
 * 获取某节点所在树的所有叶子节点id
 * @param {*} hamster 
 * @param {*} id 
 */
export function getAllLeafIds (hamster, id) {
    const ancestorId = getAncestorId(hamster, id);

    if (!ancestorId) return Immutbale.List()
    return getLeafIds(hamster, ancestorId)
}
