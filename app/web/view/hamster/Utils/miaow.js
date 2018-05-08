import {isFunction, reduce} from 'lodash';
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
export function dispatchMission (...funs) {
    const size = funs.length;
    return (...args) => {
        for (let i = 0; i < size; i++) {
            const fun = funs.pop();
            const ret = fun.apply(null, args);
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

/**
 * 将origin的方法扩展到target
 * @param {class} target 
 * @param {class} origin 
 */
export function extend(Target, ...mixins) {
    class Extend extends Target {}

    for (let mixin of mixins) {
        // TODO: 实例属性复制不了
        copyProperties(Extend, mixin); // 拷贝静态属性
        copyProperties(Extend.prototype, mixin.prototype); // 拷贝原型属性,es6类class方法都在prototype上
    }
  
    return Extend;
}

/**
 * 拷贝对象除（consturctor, prototype, name）之外的自身属性属性， 包括不可枚举属性
 * @param {object} target 
 * @param {object} source 
 */
export function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (!['constructor', 'prototype', 'name'].includes(key)) {
            // 拷贝自身属性的一对方法，拷贝的结果通过 对象.属性 来使用，拷贝prototype时可以用来混合类的属性及方法
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
