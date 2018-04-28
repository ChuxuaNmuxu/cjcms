import {List} from 'immutable';

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
