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
        // addBlock时会生成唯一id
    }

    clickBlock (payload) {
        this.dispatch(blockActions.click(payload))
    }

    blockDelete (payload) {
        this.dispatch(blockActions.blockDelete(payload))
    }


    dragEnd (payload) {
        this.dispatch(blockActions.dragEnd(payload))
    }

    resizeEnd (payload) {
        this.dispatch(blockActions.resizeEnd(payload))
    }

    rotateEnd (payload) {
        this.dispatch(blockActions.rotateEnd(payload))
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
