import styleConfig, {add} from './styleConfig';
import {isFunction, reduce, flowRight, curryRight, curry, values, keys, join, filter, pickBy} from 'lodash';
import {Map, fromJS} from 'immutable';
import { getBlockConfigByData } from '../../../../utils/config';

/**
 * 处理嵌套的属性
 * @param {Map} props 
 * @param {Map} propsConfig
 */
const handleNestProps = (props, initData, propsConfig=Map()) => {
    return propsConfig.reduce((acc, v, k) => {
        // 嵌套属性
        if (Map.isMap(v) && v.get('props')) {
            handleNestProps(props, acc, v.get('props'));
            return acc;
        }

        /**
         * 自定义formatter对属性解析
         * 内置formatter对常用属性解析
         * 默认使用该值
         * */
        // 优先取数据内的formatter
        const formatter = v.get('formatter') || styleConfig.getIn([k, 'formatter']);
        const name = styleConfig.getIn([k, 'name']) || k;
        const value = props.get(k);
        
        if (!formatter) {
            // 没有formatter直接取值
            acc[name] = value;
            return acc;
        }

        // 有formatter使用formatter
        acc[name] = isFunction(formatter) ? formatter(value) : null;
        return acc;
    }, initData)
}

/**
 * 生成基础style
*/
export const baseStyleParser = block => {
    const blockConfig = getBlockConfigByData(block);
    const propsConfig = blockConfig.get('props');
    const props = block.getIn(['data', 'props']);

    const style = handleNestProps(props.flatten(), {}, propsConfig)
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

    props.style = filterNotObject(props.style)(block.getIn(['data', 'props', 'border']))

    return props;
}

/**
 * immutable对象的keys
 * @param {Map} obj 
 */
const immutableKeys = map => {
    return map.keySeq().toList();
}

/**
 * 删除style的样式
 * @param {List} props 
 * @param {object} style 
 */
export const removeProps = (props, style) => {
    if (Map.isMap(style)) {
        return style.filter((v, k) => {
            return !props.includes(k);
        })
    }

    return pickBy(style, (v, k) => {
        return !props.includes(k);
    });
}

/**
 * 从对象中检出对象
 */
export const filterNotObject = style => {
    return flowRight(curryRight(removeProps)(style), immutableKeys)
}

/**
 * aniamtion 单独处理
*/
const animationParse = props => {
    const {block, style} = props;
    const animationProps = block.getIn(['data', 'props', 'animation']);
    if (!animationProps) return props;

    /**
     * 入场时触发返回正常动画
     * 点击触发返回reveal自定义属性
     */
    // props.style = filterNotObject(props.style)(animationProps);
    const trigger = animationProps.get('trigger');
    if (trigger === 'click') {
        // 删除style内的animation
        props.style = pickBy(style, (v, k) => !/animation/.test(k));
        return {
            ...props,
            animation: {
                className: animationProps.get('effect'),
                'data-fragment-index': animationProps.get('index')
            }
        }
    }

    return props;
}

export default flowRight(
    animationParse,
    shapeBorderParser,
    baseStyleParser
);
