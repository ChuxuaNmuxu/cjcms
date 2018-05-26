import * as nodeHelper from './node';
import lodash from 'lodash';
import * as miaow from '../../Utils/miaow';

export const getActivatedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}

// 获取激活元素中的祖先元素
export const getAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);
    const ancestorIds = activatedIds.map(lodash.curry(nodeHelper.getAncestorIdSecurely)(hamster));

    return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
}

// 在激活元素中去除祖先元素
export const removeAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);
    const ancestorIds = getAncestorInCurrent(hamster);

    return miaow.getComplement(activatedIds, ancestorIds);
}

// 获取激活元素中的孤立元素
export function getOrphansInCurrent (hamster) {
    const activatedIds = getActivatedBlockIds(hamster);
    return activatedIds.filter(id => nodeHelper.isOrphan(hamster, id))
}

/**
 * 节点群组
 * @description 在激活的节点中找到孤立节点 + 祖先节点之下的所有叶子节点
 * @param {*} hamster 
 */
export function getIdClusterInCurrent (hamster) {
    const orphanIdsInCurrent = getOrphansInCurrent(hamster);
    const ancestorBlockIds = getAncestorInCurrent(hamster);
    const allLeafBlockIds = ancestorBlockIds.map(lodash.curry(nodeHelper.getAllLeafIds)(hamster)).flatten();

    return miaow.uniq(miaow.cat(orphanIdsInCurrent, allLeafBlockIds))
}
