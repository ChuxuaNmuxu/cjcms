import * as nodeHelper from './node';
import lodash from 'lodash';
import * as miaow from '../../Utils/miaow';

export const getActivatedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}

export const getActivatedSlideIds = (hamster) => {
    return hamster.getIn(['current', 'slides'])
}

export const getActivatedSlideGroupId = (hamster) => {
    return hamster.getIn(['current', 'slide.group'])
}

// 获取激活元素中的祖先元素
export const getAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);
    const ancestorIds = activatedIds.map(lodash.curry(nodeHelper.getAncestorIdSecurely)(hamster));

    return lodash.flow(miaow.uniq, miaow.effect)(ancestorIds);
}

// 在激活元素中取出祖先元素
export const removeAncestorInCurrent = (hamster) => {
    const activatedIds = getActivatedBlockIds(hamster);
    const ancestorIds = getAncestorInCurrent(hamster);

    return miaow.getComplement(activatedIds, ancestorIds);
}
