import styleConfig, {add} from './styleConfig';
import {isFunction, reduce, flowRight, curryRight, curry, values, keys, join, filter, pickBy} from 'lodash';
import {Map, fromJS} from 'immutable';

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
export const baseStyleParser = block => {
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
    const {block} = props;
    const animationProps = block.getIn(['data', 'props', 'animation']);
    if (!animationProps) return props;

    /**
     * 入场时触发返回正常动画
     * 点击触发返回reveal自定义属性
     */
    props.style = filterNotObject(props.style)(animationProps);
    const trigger = animationProps.get('trigger');
    if (trigger === 'click') {
        // 删除style内的animation

        return {
            ...props,
            animation: {
                className: animationProps.get('effect'),
                'data-fragment-index': animationProps.get('index')
            }
        }
    }

    // animation css属性
    props.style.animation = flowRight(
        add(' forwards'),
        curryRight(join)(' '),
        values,
        configProps({}),
        curry(removeProps)(fromJS(['trigger', 'index']))
    )(animationProps);
    return props;
}

export default flowRight(
    animationParse,
    shapeBorderParser,
    baseStyleParser
);
