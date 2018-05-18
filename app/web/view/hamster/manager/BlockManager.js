import {fromJS, Map} from 'immutable'
import uuid from 'uuid';

import HamsterManager from './HamsterManager';
import blockActions from '../actions/block';
import {getActivedBlockIds} from '../reducers/helper/current'

/**
 * 递归提取block属性
 * @param {*} block
 */
const extractBlockProps = (block) => {
    return block.get('props')
        .reduce(
            (reduction, v, k) => reduction.set(
                k,
                v.has('props') ? extractBlockProps(v) : v.get('value')
            ),
            Map()
        )
}

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
        blocks = blocks.map(this.extractBlockData);
        this.dispatch(blockActions.add({blocks}));
        // addBlock时会生成唯一id
    }

    /**
     * 从配置中提取数据
     * @param {*} block
     */
    extractBlockData = (block) => {
        let data = (block.get('data') || Map()).merge({
            type: block.get('name'),
            props: extractBlockProps(block)
        });

        return this.hamster.entityManager.createEntity('block', data);
    }

    /**
     * 激活blocks
     * @param {*} blockIds
     */
    activateBlock (blockIds) {
        this.dispatch(blockActions.activate({blockIds}))
    }

    getActivedBlockIds () {
        return getActivedBlockIds(this.getState('hamster'))
    }
}

export default BlockManager
