import {fromJS, Map, List} from 'immutable';
import uuid from 'uuid';

import {HAMSTER} from '../../../actions/actionTypes'
import blockActions from '../actions/block'
import * as miaow from '../Utils/miaow'

/**
 * 递归提取block属性
 * @param {*} block
 */
const extractBlockProps = (block) => {
    return block.get('props')
        .reduce(
            (reduction, v, k) => reduction.set(k, v.has('props') ? extractBlockProps(v) : v.get('value')),
            Map()
        )
}

const BlockUtils = {
    /**
     * 添加
     */
    addBlock: function (block) {
        this.addBlocks([block]);
    },

    /**
     * 添加多个
     */
    addBlocks: function (blocks) {
        blocks = fromJS(blocks);
        blocks = blocks.map(this.extractBlockData);
        BlockUtils.dispatch(blockActions.add({blocks}));
        // addBlock时会生成唯一id
    },

    /**
     * 从配置中提取数据
     * @param {*} block
     */
    extractBlockData (block) {
        let data = Map();
        data = data.withMutations(data => {
            data.set('id', 'block-' + uuid.v4());
            data.set('type', 'block');
            data.setIn(['data', 'type'], block.get('name'));
            data.setIn(['data', 'props'], extractBlockProps(block));
            data.mergeIn(['data'], block.get('data'));
            // TODO：props应该还有校验过程
        })
        return data;
    },

    clickBlock (payload) {
        BlockUtils.dispatch(blockActions.click(payload))
    },

    /**
     * 移动blocks
     * @param {Array} blockIds 
     * @param {object} offset
     */
    moveBlocks (blockIds, offset={}) {
        BlockUtils.dispatch(blockActions.entitiesChange({
            blockIds,
            operations: fromJS({
                'data.props.top': miaow.add(offset.get('top')),
                'data.props.left': miaow.add(offset.get('left'))
            })
        }))
    },

    // 组合元素
    groupUnite () {
        BlockUtils.dispatch(blockActions.groupUnite())
    }
}

export default BlockUtils;
