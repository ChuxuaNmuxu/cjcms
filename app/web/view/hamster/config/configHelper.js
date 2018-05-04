import {List, Map} from 'immutable';

import * as extensions from './extensions';
import * as config from './config';
import { isString } from 'lodash';

/**
 * 配置管理类
 */
class ConfigHelper {
    blocks;

    constructor () {
        this.init();
    }

    init () {
        this.initBlocks();
    }

    initBlocks () {
        let blocks = config.blocks.concat(extensions.blocks || List([]));
        this.blocks = blocks.map(block => {
            block = block.update('propsbar', this.handleBlockPropsLayout);
            block = config.defaultBlockConfig.mergeDeep(block)
            return block.update('props', this.handleBlockProps);
        });
    }

    getBlock (name) {
        return this.blocks.find(block => block.get('name') === name)
    }

    /**
     * 获取多个block合并后的属性
     * @param {*} blocks 
     */
    getBlocksProps (blocks) {
        let props = blocks.reduce((memo, block) => {
            const currentProps = this.getBlock(block.getIn(['data', 'type'])).get('props');
            if (!memo) {
                memo = currentProps;
            } else {
                // 取出有相同widget的属性
                memo = memo.filter(item => {
                    const widget = item.get('widget');
                    return widget && currentProps.find(prop => prop.get('widget') === widget)
                })
            }
            return memo;
        }, null);
        // 跟默认属性合并
        props = config.defaultBlockConfig.get('props').mergeDeep(props)
        return this.handleBlockProps(props)
    }

    /**
     * 获取多个block合并后的属性布局
     * @param {*} blocks 
     */
    getBlocksLayout (blocks) {
        const props = this.getBlocksProps(blocks)
        let layout;
        if (blocks.size > 1) {
            const defaultProps = config.defaultBlockConfig.get('props');
            const customProps = props.filterNot((item, k) => defaultProps.has(k))
            const customLayout = customProps.map(p => p.get('name')).toList()
            const defaultLayout = this.getBlock('text').get('propsbar').slice(0, 2);
            layout = defaultLayout.push(Map({
                name: 'custom',
                title: '自定义',
                layout: customLayout
            }))
        } else {
            layout = this.getBlock(blocks.getIn([0, 'data', 'type'])).get('propsbar');
        }
        return {
            props,
            layout
        };
    }

    /**
     * 递归处理block属性
     * @param {*} block 
     */
    handleBlockProps = (props) => {
        return props.map((v, k) => {
            // 处理属性套件
            let widget = v.get('widget')
            if (widget) {
                if (isString(widget)) {
                    widget = require(`../Widget/props/${widget}`).default
                }
                v = v.mergeDeep(widget)
            }
            if (v.has('props')) {
                v = v.update('props', this.handleBlockProps);
            }
            return v.set('name', k)
        })
    }

    /**
     * 处理block属性布局
     * TODO: 处理自定义基础和动画的布局
     */
    handleBlockPropsLayout = (layout) => {
        return config.defaultBlockConfig.get('propsbar').concat(layout || []);
    }
}

export default new ConfigHelper();
