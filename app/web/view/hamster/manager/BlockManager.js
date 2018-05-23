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

    getActivatedBlockIds () {
        return getActivatedBlockIds(this.getState('hamster'))
    }

    /**
     * 移动blocks
     * @param {Array} blockIds 
     * @param {object} offset
     */
    moveBlocks (blockIds, offset={}) {
        this.dispatch(blockActions.entitiesChange({
            blockIds,
            operations: fromJS({
                'data.props.top': miaow.add(offset.get('top')),
                'data.props.left': miaow.add(offset.get('left'))
            })
        }))
    }

    // 组合元素
    groupUnite () {
        this.dispatch(blockActions.groupUnite())
    }
}

export default BlockManager
