import lodash from 'lodash';
import uuid from 'uuid';

import * as miaow from '../../Utils/miaow';
// import BlockUtils from '../../Utils/BlockUtils';
// import {defaultBlockConfig} from '../../config/config';
import ConfigManager from '../../manager/ConfigManager';
import * as entityHelper from './entity';
import {extractBlockData} from '../../utils/block';

// 生成ID
export function createId (prefix='', suffix='') {
    return prefix + uuid.v4() + suffix
}

// 激活元素
export function handleActivateBlocks (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], lodash.flow(miaow.add(blockIds), miaow.uniq))
    return hamster;
}

// 取消元素激活状态
export function handleCancelActivateBlocks (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], miaow.minus(blockIds))
    return hamster;
}

// 重选激活的元素
export function handleReactivateBlocks (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], lodash.flow(miaow.reset, miaow.add(blockIds), miaow.uniq))
    return hamster;
}

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
