import {fromJS, Map} from 'immutable'

import HamsterManager from './HamsterManager';
import blockActions from '../actions/block';
import {getActivatedBlockIds, getOperatingBlockId, isDragging, isRotating, isResizing} from '../reducers/helper/current'
import {extractBlockData} from '../utils/block'

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

    actStart (payload) {
        this.dispatch(blockActions.actStart(payload))
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

    // 组合元素
    groupUnite () {
        this.dispatch(blockActions.groupUnite())
    }

    getActivatedBlockIds () {
        return getActivatedBlockIds(this.getState('hamster'))
    }

    getOperatingBlockId () {
        return getOperatingBlockId(this.getState('hamster'))
    }

    isDragging () {
        return isDragging(this.getState('hamster'))
    }

    isRotating () {
        return isRotating(this.getState('hamster'))
    }

    isResizing () {
        return isResizing(this.getState('hamster'))
    }

}

export default BlockManager
