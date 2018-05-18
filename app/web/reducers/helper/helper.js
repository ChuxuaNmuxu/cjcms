import lodash from 'lodash';
import * as miaow from '../../view/hamster/Utils/miaow';

// 激活元素
export function handleActivateBlock (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], miaow.add(blockIds))
    return hamster;
}

// 取消元素激活状态
export function handleCancelActivateBlocks (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], miaow.minus(blockIds))
    return hamster;
}

// 重选激活的元素
export function handleReactivateBlocks (hamster, blockIds) {
    hamster = hamster.updateIn(['current', 'blocks'], lodash.flow(miaow.reset, miaow.flowDebug, miaow.add(blockIds)))
    return hamster;
}