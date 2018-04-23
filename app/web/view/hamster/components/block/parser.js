import configHelper from '../../config/configHelper';
import styleConfig from './styleConfig';
import {isFunction, reduce, flowRight} from 'lodash';
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
const handleNestProps = (props, propsConfig, initData) => {
    return props.reduce((acc, v, k) => {
        // 优先取数据内的formatter
        const formatter = propsConfig.getIn([k, 'formatter']);
        
        if (!formatter) {
            // 嵌套属性
            if (Map.isMap(v)) {
                handleNestProps(v, propsConfig, acc);
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

/**
 * 生成基础style
*/
const baseStyleParser = block => {
    const props = block.getIn(['data', 'props']);

    const style = handleNestProps(props, styleConfig, {})
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

    const {style} = props;
    Object.keys(style).forEach(v =>{
        if (/^border/.test(v))
        delete style[v]
    })
    return props;
}


export default flowRight(shapeBorderParser ,baseStyleParser);
