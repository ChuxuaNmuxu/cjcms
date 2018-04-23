import configHelper from '../../config/configHelper';
import styleConfig, {add} from './styleConfig';
import {isFunction, reduce, flowRight, curryRight, values, keys, join, filter} from 'lodash';
import {Map} from 'immutable';

const choose = (...args) => {
    return (...args) => {
        args.forEach(fn => {
            const result = fn(...args)
            if (result !== undefined) return result;
        })
    }
}

/**
 * 处理嵌套的属性
 * @param {Map} props 
 * @param {Map} propsConfig
 * @param {Map} initData
 */
const handleNestProps = (props, initData, propsConfig) => {
    return props.reduce((acc, v, k) => {
        // 优先取数据内的formatter
        const formatter = propsConfig.getIn([k, 'formatter']);
        
        if (!formatter) {
            // 嵌套属性
            if (Map.isMap(v)) {
                handleNestProps(v, acc, propsConfig);
                return acc;
            }
            // 没有formatter直接取值
            acc[k] = v;
            return acc;
        }

        // 有formatter使用formatter
        acc[k] = isFunction(formatter) ? formatter(v) : null;
        return acc;
    }, initData)
}

const configProps = curryRight(handleNestProps)(styleConfig);

/**
 * 生成基础style
*/
const baseStyleParser = block => {
    const props = block.getIn(['data', 'props']);

    const style = configProps(props, {})
    return {
        block,
        style
    }
}

/**
 * 处理shape的border
*/
const shapeBorderParser = props => {
    const {block} = props;
    if (block.getIn(['data', 'type']) !== 'shape') return props;

    removeProps(block.getIn(['data', 'props', 'border']).keySeq().toList(), props.style);

    return props;
}

/**
 * 删除style的样式
 * @param {Array} props 
 * @param {object} style 
 */
const removeProps = (props, style) => {
    props.map(prop => {
        delete style[prop]
    })
}

/**
 * aniamtion 单独处理
*/
const animationParse = props => {
    const {block} = props;
    const animationProps = block.getIn(['data', 'props', 'animation']);
    if (!animationProps) return props;

    /**
     * 入场时触发返回正常动画
     * 点击触发返回reveal自定义属性
     */
    let animation = {};
    const trigger = animationProps.get('trigger');
    if (trigger === 'click') {
        animation = {
            className: animationProps.get('effect'),
            'data-fragment-index': animationProps.get('index')
        }
    }

    animation = flowRight(add(' forwards'), curryRight(join)(' '), values, configProps({}))(animationProps);

    removeProps(animationProps.keySeq().toList(), props.style)

    return {
        ...props,
        animation
    }
}

export default flowRight(
    animationParse,
    shapeBorderParser,
    baseStyleParser
);
