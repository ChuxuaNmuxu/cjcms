import lodash from 'lodash';
import Immutable from 'immutable';

import * as miaow from '../../Utils/miaow';
import * as entityHelper from './entity';
import { getActivatedBlockIds, resistOutside } from './current';
import { getAllLeafIds, isAncestor } from './node';

/**
 * 包裹blocks的框的位置及大小
 * @description minTop, maxBottom(top + height), minLeft, maxRight(left + width) 
 * @param {*} hamster 
 * @param {*} ids 
 * @returns {plainObject} {top, bottom, left, right, width, height}
 */
export function packageBlocks (hamster, ids) {
    ids = miaow.toList(ids);
    const [tops, lefts, widths, heights] = ['top', 'left', 'width', 'height'].map(
        value => ids.map(lodash.flow(lodash.curry(entityHelper.getEntity)(hamster), miaow.get('data.props.'.concat(value))))
    )

    const [bottoms, rights] = [miaow.listAdd(tops, heights), miaow.listAdd(lefts, widths)];

    const [packageTop, packageLeft, packageBottom, packageRight] = [tops.min(), lefts.min(), bottoms.max(), rights.max()]

    return  {
        top: packageTop,
        left: packageLeft,
        bottom: packageBottom,
        right: packageRight,
        width: packageRight - packageLeft,
        height: packageBottom - packageTop
    }
}

/**
 * 包裹blocks的框的四维
 * @param {*} hamster 
 * @param {*} id 
 * @returns {plainObject} {top, left, width, height}
 */
export function getPackageFourDimension (hamster, ids) {
    return lodash.pick(packageBlocks(hamster, ids), ['left', 'top', 'width', 'height']);
}

/**
 * 更新元素框的四维
 * @param {*} hamster 
 * @param {Map} payload Map({top, left, width, height})
 */
export function updateBlockFourDimension (hamster, ids, payload) {
    return entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids,
        operations: payload.reduce((accu, v, k) => {
            accu['data.props.'.concat(k)] = miaow.replaceAs(v)
            return accu;
        }, {})
    }))
}

/**
 * 扩大一个block
 * @param {*} hamster 
 * @param {*} id 
 * @param {*} gap 扩大的距离
 */ 
export function stretchBlock (hamster, id, gap=0) {
    const FourDimension = getPackageFourDimension(hamster, miaow.toList(id));
    const packageDimensionWithGap = {
        left: FourDimension.left - gap,
        top: FourDimension.top - gap,
        width: FourDimension.width + gap * 2,
        height: FourDimension.height + gap * 2
    }

    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids: id,
        operations: lodash.reduce(packageDimensionWithGap, (accu, v, k) => {
            accu['data.props.'.concat(k)] = miaow.replaceAs(v)
            return accu;
        }, {})
    }))

    return hamster;
}

/**
 * 钉住一个点  
 * @param {Object} fourDimension 四维
 * @param {Object} offset 偏移
 * @param {*} point 钉子的坐标  String | Object
 * @returns {plainObject}
 */
const pointToCoordinate = {
    'nw': {x: 0, y: 0},
    'sw': {x: 0, y: 1},
    'ne': {x: 1, y: 0},
    'se': {x: 1, y: 1},
    'n': {x: 0.5, y: 0},
    's': {x: 0.5, y: 1},
    'e': {x: 1, y: 0.5},
    'w': {x: 0, y: 0.5}
}
export function pin (fourDimension, offset, point) {
    // 钉子的坐标
    const pinCoordinate = lodash.isString(point) ? pointToCoordinate[point] : point;

    return {
        ...fourDimension,
        width: fourDimension.width + offset.x,
        height: fourDimension.height + offset.y,
        left: fourDimension.left - offset.x * pinCoordinate.x,
        top: fourDimension.top - offset.y * pinCoordinate.y
    };
}

/**
 * 将被操作的正确block
 * @param {*} hamster 
 * @description 对外：所有激活元素；对内：去掉祖先元素
 * @returns {Array} 全是叶子节点或者没有叶子节点
 */
export function getRightBlock (hamster) {
    const activatedBlockIds = getActivatedBlockIds(hamster);
    if (resistOutside(hamster, activatedBlockIds)) return activatedBlockIds;
    return activatedBlockIds.filter(id => !isAncestor(hamster, id));
}

/**
 * 将被drag的正确block
 * @param {*} hamster 
 * @description 祖先节点->整棵树
 */
export const rightBlockToDrag = hamster => lodash.flow(
    getRightBlock,
    miaow.map(id => isAncestor(hamster, id) ? miaow.cat(id, getAllLeafIds(hamster, id)) : id),
    miaow.handle('flatten')
)(hamster)

/**
 * 将被resize的正确block
 * @param {*} hamster 
 * @description 去掉祖先节点
 */
export const rightBlockToResize = hamster => lodash.flow(
    getRightBlock,
    miaow.filter(id => !isAncestor(hamster, id)),
)(hamster)

/**
 * 将被rotate的正确block
 * @param {*} hamster 
 * @description 祖先节点->整棵树
 */
export const rightBlockToRotate = rightBlockToDrag;
