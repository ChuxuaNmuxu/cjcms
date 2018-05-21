import {fromJS, Map} from 'immutable'
import uuid from 'uuid';

import HamsterManager from './HamsterManager';
import blockActions from '../actions/block';
import {getActivedBlockIds} from '../reducers/helper/current'
import {extractBlockData} from '../utils/BlockUtils'

class BlockManager extends HamsterManager {
    /**
     * 添加
     */
    addBlock (block) {
        this.addBlocks([block]);
    }

    /**
     * 添加多个
     */
    addBlocks (blocks) {
        blocks = fromJS(blocks);
        blocks = blocks.map(extractBlockData);
        this.dispatch(blockActions.add({blocks}));
        // addBlock时会生成唯一id
    }

    /**
     * 激活blocks
     * @param {*} blockIds
     */
    activateBlock (blockIds) {
        this.dispatch(blockActions.activate({blockIds}))
    }

    clickBlock (payload) {
        this.dispatch(blockActions.click(payload))
    }

    getActivedBlockIds () {
        return getActivedBlockIds(this.getState('hamster'))
    }

    // 组合元素
    unite () {
        this.dispatch(blockActions.unite())
    }
}

export default BlockManager
