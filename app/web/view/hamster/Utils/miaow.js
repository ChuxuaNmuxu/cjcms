import lodash from 'lodash';
import {isValidElement} from 'react';
import Immutable from 'immutable';

/**
 * 加
 * @param {any} addend 被加数
 */
export function add (addend) {
    if (!existy(addend)) throw new Error('addend is not existy');
    
    const checkedArray = prevCheck(value => value.concat && value.pop);
    
    const checkoutMap = prevCheck(value => addend.merge && value.merge);
    
    const checkedPlainObject = prevCheck(
        () => lodash.isObject(addend),
        lodash.isObject
    );
    
    const checkedNumber = prevCheck(
        () => lodash.isNumber(addend),
        lodash.isNumber
    )
    
    const defaultAdd = value => `${value}${addend}`;

    return dispatchMission(
        checkedArray(value => value.concat(addend)),
        checkoutMap(value => value.merge(addend)),
        checkedPlainObject(value => lodash.merge({}, value, addend)),
        checkedNumber(value => value + addend),
        defaultAdd
    )
}

/**
 * 减
 * @param {*} minuend 被减数
 */
export function minus (minuend) {
    if (!existy(minuend)) throw new Error('minuend is not existy');

    const minuends = Immutable.List().concat(minuend);
    
    const checkedFilter = prevCheck(value => value.filter);
    
    const checkedPlainObject = prevCheck(
        () => lodash.isObject(minuend),
        lodash.isObject
    );
    
    const checkedNumber = prevCheck(
        () => lodash.isNumber(minuend),
        lodash.isNumber
    )
    
    // TODO: 待优化
    return value => minuends.reduce((value, minuend) => {
        return dispatchMission(
            checkedFilter(value => value.filter(item => item !== minuend)),
            checkedPlainObject(object => Reflect.deleteProperty(object, minuend)),
            checkedNumber(value => value - minuend),
            lodash.identity
        )(value)
    }, value)
}

//
export function replaceAs (value) {
    return () => value
}

/**
 * 列表化
 * @param {*} value 
 */
export function toList (value) {
    return Immutable.List().concat(value);
}

/**
 * 浅解构
 * @param {*} data 
 * @param {*} args 
 */
export function destruction (data, ...args) {
    return args.map(path => data.get && data.get(path))
}

/**
 * 重置
 * @param {*} value 
 */
export const reset = dispatchMission(
    prevCheck(value => value.clear)(value => value.clear()),
    prevCheck(lodash.isObject)(() => {}),
    prevCheck(lodash.isArray)(() => []),
    prevCheck(lodash.isNumber)(() => 0),
    prevCheck(lodash.isString)(() => ''),
    () => null
)

/**
 * 参数预校验
 * 在执行execFunc前，根据校验条件checkoutFunc对参数args进行校验，不通过返回undefined，通过返回函数执行结果
 * @param {any} args
 */
export function prevCheck (...funcs) {
    const andFuncs = and(funcs);
    return (execFunc) => (...args) => {
        if (!andFuncs.apply(null, args)) return undefined;
        return execFunc.apply(null, args)
    }
}

/**
 * 判断value是否存在(不为undefined或null)
 * @param {any} value 
 */
function existy (value) {
    return value != null;
}

/**
 * 与
 * @param {Array} funcs 
 */
export function and (funcs) {
    return (...args) => lodash.reduce(funcs, (accu, func) => {
        if (!lodash.isFunction(func)) func = () => !!func;
        return accu && func.apply(func, args);
    }, true);
}

/**
 * flow中打印输出debug
 * @param {any} args 
 */
export const flowDebug = (args) => {
    console.log('flowDebug', args);
    return args;
}

/**
 * 派遣任务
 * 依次执行函数，直到遇到第一个函数执行结果返回的不是undefined，返回该结果，否则返回undefined
 * @param {function} funs 
 */
export function dispatchMission (...funs) {
    const size = funs.length;
    return (...args) => {
        for (let i = 0; i < size; i++) {
            /**
             * 函数尽量不改变输入值
             * @issue: reset 在直接使用dispatchMission时以闭包的形式保存了funcs,如果用shift消耗掉了参数funcs,
             * 那么第二次使用时funcs就是个已消耗的数组
             * */
            // const fun = funs.shift();
            const fun = funs[i];
            const ret = fun.apply(null, args);
            if (ret != null) return ret;
        }
        return undefined;
    }
}

export const isValidateReactComponent = component => {
    // TODO: 其他情况判断
    // 实例化组件，function, 继承自Component的class
    return isValidElement(component) || lodash.isFunction(component) || component.render;
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

/******* immutable *********/

/**
 * 数组连接
 * @param {*} args 
 */
export function cat (...args) {
    return lodash.reduce(args, (accu, arg) => accu.concat(arg), Immutable.List())
}

/**
 * 取交集
 * @param {*} args 
 */
export function getIntersection (...args) {
    const [head, ...rest1] = args;

    if (rest1.length === 0) return Immutable.List();

    const [second, ...rest2] = rest1;

    // 两个数组取交集
    const intersection = head.reduce((accu, v) => {
        if (second.includes(v) && !accu.includes(v)) return accu.push(v)
        return accu;
    }, Immutable.List())

    return getIntersection(intersection, ...rest2);
}
