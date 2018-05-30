import {fromJS, Map} from 'immutable'
import uuid from 'uuid';

import HamsterManager from './HamsterManager';
import blockActions from '../actions/block';
import {getActivatedBlockIds} from '../reducers/helper/current'
import {extractBlockData} from '../utils/block'
import * as miaow from '../Utils/miaow'

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
    }

    clickBlock (payload) {
        this.dispatch(blockActions.click(payload))
    }

    dragEnd (payload) {
        this.dispatch(blockActions.dragEnd(payload))
    }

    getActivatedBlockIds () {
        return getActivatedBlockIds(this.getState('hamster'))
    }

    // 组合元素
    groupUnite () {
        this.dispatch(blockActions.groupUnite())
    }
}

export default BlockManager
