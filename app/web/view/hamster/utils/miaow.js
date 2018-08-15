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

/**
 * 替换
 * @param {*} value 
 */
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
 * @return {Array}
 */
export const destruction = (...args) => data => {
    return args.map(path => {
        if (!(existy(path) && data.get)) return []
        return data.get(path)
    })
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
    const andFuncs = and.apply(null, funcs);
    return (execFunc) => (...args) => {
        if (!andFuncs.apply(null, args)) return undefined;
        return execFunc.apply(null, args)
    }
}

/**
 * 判断value是否存在(不为undefined或null)
 * @param {any} value 
 */
export function existy (value) {
    return value != null;
}

// export function identity (value) {
//     return () => value;
// }

export const identity = value => value

/**
 * 与
 * @param {Array} funcs 
 */
export function and (...funcs) {
    return function (...args) {
        return lodash.reduce(funcs, (accu, func) => {
            if (!lodash.isFunction(func)) func = always(Boolean(func));
            return accu && func.apply(func, args);
        }, true);
    }
}

/**
 * 或
 * @param {*} funcs 
 */
export function or (...funcs) {
    return (...args) => lodash.reduce(funcs, (accu, func) => {
        if (!lodash.isFunction(func)) func = always(Boolean(func));
        return accu || func.apply(func, args);
    }, false);
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
    if (!component) return false;
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

/**
 * 带默认处理的dispatchMission
 * @param {*} func 
 * @param {*} funcs 
 */
export function ultimate (defaultHandle) {
    return (...args) => {
        const funcs = args.concat(defaultHandle);
        return dispatchMission.apply(null, funcs)
    }
}

export function not (func) {
    return (...args) => {
        const result = func.apply(null, args)

        if (lodash.isFunction(result)) return not(result)
        return !result;
    }
}

export const isTrue = value => value === true;

/**
 * 求与纵轴夹角
 * @param {Array} center 顶角坐标
 * @param {Array} another 另一点坐标
 * @returns {number} 取值范围: 0~360度
 */
export function angleToVerticalAxis (center, another) {
    const offset = {
        x: another[0] - center[0],
        y: center[1] - another[1]
    }

    const rotateRadian = Math.atan(offset.x / offset.y);
    let rotateAngle = rotateRadian * 180 / Math.PI;

    // 修正旋转角在0-360之间
    if (offset.y < 0) {
        rotateAngle += 180;
    } else if (offset.y > 0 && offset.x < 0) {
        rotateAngle += 360;
    }

    return rotateAngle;
}

/**
 * 已知3个坐标，求夹角
 * @param {Array} center 顶角坐标
 * @param {Array} start 起始点坐标
 * @param {Array} end 终点坐标
 * @returns {number} 取值范围: -360~360度
 */
export function getAngleByThreeCoord (center, start, end) {
    const startAngel = angleToVerticalAxis(center, start);
    const endAngel = angleToVerticalAxis(center, end);
    return endAngel - startAngel
}

/**
 * 勾股定理求直角三角形第三边
 * @param {*} a 
 * @param {*} b 
 */
export const getThirdSideLengthInRightTriangle = (a, b) => Math.sqrt(a * a + b * b);

/**
 * 极坐标转笛卡尔坐标
 * @param{Array} coord 极坐标 [angle, r]
 */
export const coordPCSToDescartes = coord => {
    const [angle, r] = coord;
    const radian = angle * Math.PI / 180;

    return [
        r * Math.sin(radian),
        -r * Math.cos(radian),
    ]
}

export function always (value) {
    return () => value
}

/**
 * 恒为真
 */
export const alwaysTrue = always(true);


/**
 * 恒为假
 */
export const alwaysFalse = always(false);

/**
 * 数组对应位置相减 a - b
 * @param {*} a 
 * @param {*} b
 */
export const arrMinus = a => b => {
    return lodash.flow(
        lodash.zip,
        map(
            arr => lodash.subtract.apply(null, arr)
        )
    )(a, b)
}

// {x, y}转换为坐标形式
export const getCoord = maybeCoord => {
    if (maybeCoord.x && maybeCoord.y) return [maybeCoord.x, maybeCoord.y];
    if (maybeCoord.top && maybeCoord.left) return [maybeCoord.left, maybeCoord.top]
    return maybeCoord;
}

/**
 * 根据两个坐标求四维
 * @param {Array} c1 
 * @param {Array} c2 
 */
export const getBox = (a, b) => {
    const zip = lodash.zip(a, b);

    const [left, top] = zip.map(v => Math.min.apply(null, v))
    const [right, bottom] = zip.map(v => Math.max.apply(null, v))
    return {
        left,
        top,
        width: right - left,
        height: bottom - top
    }
}

/**
 * 浅比较
 * @param {*} a 
 * @param {*} b 
 */
export const shallowEqual = (a, b) => {
    if (a === b) return true;

    // immutable
    if (Immutable.is(a, b)) return true;

    if (!existy(a) || !existy(b)) return false;

    if (lodash.isArray(a) && lodash.isArray(b)) {
        for (var i = 0; i < a.length; i += 1) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

	var keysA = Object.keys(a);
	var keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	var hasOwn = Object.prototype.hasOwnProperty;
	for (var i = 0; i < keysA.length; i += 1) {
        if (!hasOwn.call(b, keysA[i])) return false;
        if (a[keysA[i]] !== b[keysA[i]] && !Immutable.is(a[keysA[i]], b[keysA[i]])) return false;
	}

	return true;
}

// 多管道
export const muiltyPipe = (funcs) => (args) => {
    const lastFunc = lodash.nth(funcs, -1);
    return args.map((arg, k) => {
        let func = funcs[k];
        if (!existy(func)) {
            func = lastFunc;
        }
        return funcs[k](arg)
    })
};

// 接受参数数组
export const apply = func => args => func.apply(null, args)

// omit
export const omit = (...args) => props => lodash.omit.apply(null, [props].concat(args))

// 加上单位(普通的字符串拼接)
export const addUnit = unit => value => `${value}${unit}`;
export const addPx = addUnit('px')

export const map = func => array => lodash.map(array, func);

export const concat = a => b => lodash.concat(a, b)

/******* immutable *********/

/**
 * 数组连接
 * @param {*} args 
 */
export function cat (...args) {
    return lodash.reduce(args, (accu, arg) => accu.concat(arg), Immutable.List())
}

/**
 * 数组取交集
 * @param {*} args 
 */
export function getIntersection (...args) {
    const [head, ...rest1] = args;

    if (rest1.length === 0) return head;

    const [second, ...rest2] = rest1;

    // 两个数组取交集
    const intersection = head.reduce((accu, v) => {
        if (second.includes(v) && !accu.includes(v)) return accu.push(v)
        return accu;
    }, Immutable.List())

    return getIntersection(intersection, ...rest2);
}

/**
 * 数组取补集
 * @description b为a的子集
*/
export function getComplement (a, b) {
    if (!b.isSubset(a)) throw new Error('to be relationship of subset');

    return a.reduce((accu, v) => {
        if (b.includes(v)) return accu;
        return accu.push(v)
    }, Immutable.List())
}

/**
 * 取差异的部分
 * @description a不包含b的部分
*/
export function getDefference (a, b) {
    const intersection = getIntersection(a, b);
    return getComplement(a, intersection);
}

/**
 * 去重
 */
export function uniq (a) {
    return a.toSet().toList()
}

/**
 * 去null和undefined
 */
export function effect (a) {
    return a.filter(v => existy(v))
}

/**
 * get
 * @param {*} value 
 * @param {*} path 
 */
export function get (path) {
    path = lodash.isArray(path) ? path : path.split('.');
    return value => value.getIn(path)
}

/**
 * 求和
 * @param {*} list
 */
export function sum (list) {
    return list.reduce((sum, v) => sum + v, 0)
}

export const overI = funcs => (...arg) => Immutable.fromJS(funcs.map(func => func.apply(null, arg)))

/**
 * 数组对应位置求和
 * @param {*} a 
 * @param {*} b 
 */
export function listAdd (a, b) {
    return a.zip(b).map(sum)
}

/**
 * 除去第一个元素
 * @param {*} list 
 */
export const tails = list => list.skip(1)

export const mapI = func => param => param.map(func) ;

export const filter = func => list => list.filter(func);

export const handle = operation => list => list[operation]();

export const push = value => list => list.push(value);

export const isMap = value => Immutable.Map.isMap(value);
