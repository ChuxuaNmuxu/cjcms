import {List, Map, fromJS} from 'immutable';
import { isString } from 'lodash';

import config, {extensions} from '../config';

/**
 * 配置管理类
 */
class ConfigManager {
    blocks; // 加工好的block配置列表

    constructor () {
        this.init();
    }

    init () {
        this.initSlide();
        this.initBlocks();
    }

    initSlide () {
        let slide = config.slide;
        this.slide = slide.update('props', this.handleProps)
    }

    initBlocks () {
        let blocks = config.blocks.concat(extensions.blocks || List([]));
        this.blocks = blocks.map(block => {
            block = block.update('propsbar', this.handleBlockPropsLayout);
            block = config.defaultBlockConfig.mergeDeep(block)
            return block.update('props', this.handleProps);
        });
    }

    getBlock (name) {
        const block = this.blocks.find(block => block.get('name') === name)
        if (!block) {
            throw new Error('找不到该类型的block');
        }
        return block;
    }

    /**
     * 获取多个block合并后的属性
     * @param {*} blocks 
     */
    getBlocksProps (blocks) {
        let prevBlockType;
        let props = blocks.reduce((memo, block) => {
            const blockType = block.getIn(['data', 'type']);
            const currentProps = this.getBlock(blockType).get('props');
            if (blockType === prevBlockType) {
                return memo;
            }
            if (!memo) {
                memo = currentProps;
            } else {
                // 取出有相同widget的属性
                memo = memo.filter(item => {
                    const widget = item.get('widget');

                    return widget && currentProps.find(prop => prop.get('widget') === widget)
                })
            }
            prevBlockType = blockType;
            return memo;
        }, null);
        // 跟默认属性合并
        props = config.defaultBlockConfig.get('props').mergeDeep(props)
        return this.handleProps(props)
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

    getSlidesPropsbar (slides) {
        const slideConfig = this.getSlideConfig();
        return {
            props: slideConfig.get('props'),
            layout: slideConfig.get('propsbar')
        }
    }

    getSlideConfig () {
        return this.slide;
    }

    /**
     * 捡出value属性
     */
    pickValueProps = (v) => {
        return v.reduce((reduction, v, k) => {
            switch (k) {
                case 'value':
                case 'widget':
                    reduction = reduction.set(k, v);
                    break;
                case 'props':
                    reduction = reduction.set(k, v.map(this.pickValueProps));
            }
            return reduction;
        }, Map())
    }

    /**
     * 递归处理props属性
     * @param {*} props 
     */
    handleProps = (props) => {
        return props.map((v, k) => {
            // 处理属性套件
            let widget = v.get('widget')
            if (widget) {
                if (isString(widget)) {
                    widget = require(`../widget/props/${widget}`).default
                }
                /**
                 * 从引用该widget的地方取：value、widget、props配置合并过来
                 * 以方便引用该widget的地方可以自定义默认值，扩展属性配置
                 */
                v = fromJS(widget).mergeDeep(this.pickValueProps(v))
            }
            if (v.has('props')) {
                v = v.update('props', this.handleProps);
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

export default new ConfigManager();
