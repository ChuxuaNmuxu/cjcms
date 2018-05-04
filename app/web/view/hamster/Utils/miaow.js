import {isFunction} from 'lodash';
import {isValidElement} from 'react';

/**
 * flow中打印输出debug
 * @param {any} args 
 */
const flowDebug = (args) => {
    console.log(args);
    return args;
}

/**
 * 派遣
 * 依次执行函数，直到遇到第一个函数执行结果返回的不是undefined，返回该结果，否则返回undefined
 * @param {function} funs 
 */
export const dispatchMission = (...funs) => {
    const size = funs.length;
    return (...args) => {
        for (let i = 0; i < size; i++) {
            const fun = funs.pop();
            const ret = fun(...args);
            if (ret != null) return ret;
        }
        return undefined;
    }
}

export const isValidateReactComponent = component => {
    // TODO: 其他情况判断
    // 实例化组件，function, 继承自Component的class
    return isValidElement(component) || isFunction(component) || component.render;
}