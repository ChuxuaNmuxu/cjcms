import Immutbale from 'immutable';

import * as miaow from '../../Utils/miaow';
import * as entityHelper from './entity';

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
 */
export function getChildrenIds (hamster, id) {
    const entity = entityHelper.getEntity(hamster, id); 
    return entity && entity.getIn(['data', 'children']);
}

/**
 * 获取元素的父节点id
 * @param {*} hamster 
 * @param {*} id 
 */
export function getParentId (hamster, id) {
    const entity = entityHelper.getEntity(hamster, id);
    return entity && entity.getIn(['data', 'parent']);
}

/**
 * 获取元素的祖先节点id
 * @param {*} hamster 
 * @param {*} id 
 */
// 无祖先返回当前节点
export const getAncestorOrCurrentId = (hamster, id) => {
    const parentId = getParentId(hamster, id);
    if (!parentId) return id;
    return getAncestorOrCurrentId(hamster, parentId)
}
// 无祖先节点返回undefined
export function getAncestorId (hamster, id) {
    const ancestorId = getAncestorOrCurrentId(hamster, id);
    if (ancestorId === id) return;
    return ancestorId;
}

/**
 * 获取某节点下的所有叶子节点id
 * @param {*} hamster 
 * @param {*} id 单个id或id数组
 * @param {*} seen 累加器，主要作用是为记录回调的结果，一般使用不需要传值；传值则为初始的叶子节点数组
 */
export function getLeafIds (hamster, id, seen) {
    seen = seen || Immutbale.List();
    const ids = miaow.toList(id);

    if (!ids.size) return seen;

    const head = ids.first();
    const rest = ids.delete(0);

    const children = getChildrenIds(hamster, head);

    // 满足条件，seen累加id(head)，消耗ids的size
    if (!nodesExist(children)) return getLeafIds(hamster, rest, miaow.cat(seen, head));
    // 否则，children和余下的id都满足可能产生叶子节点
    return getLeafIds(hamster, miaow.cat(rest, children), seen);
}

/**
 * 获取某节点所在树的所有叶子节点id
 * @param {*} hamster 
 * @param {*} id 
 */
export function getAllLeafIds (hamster, id) {
    const ancestorId = getAncestorId(hamster, id);
    return getLeafIds(hamster, ancestorId)
}

/**
 * 是否是一个嵌套结构
 * @param {*} hamster 
 * @param {*} id 
 */
export function isInTree (hamster, id) {
    return getChildrenIds(hamster, id).size > 0 || getParentId(hamster, id);
}

/**
 * 是否是叶子节点
 * @param {*} hamster 
 * @param {*} id 
 */
export function isLeaf (hamster, id) {
    return isInTree(hamster, id) && getChildrenIds(hamster, id).size === 0
}
