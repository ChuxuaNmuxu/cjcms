import lodash from 'lodash';
import Immutable from 'immutable';

import * as miaow from '../../Utils/miaow';
import * as entityHelper from './entity';
import * as currentHelper from './current';
import * as nodeHelper from './node';
import * as helper from './helper';

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
export function stretchBlock (hamster, ids, gap=0) {
    const FourDimension = getPackageFourDimension(hamster, miaow.toList(ids));
    const packageDimensionWithGap = {
        left: FourDimension.left - gap,
        top: FourDimension.top - gap,
        width: FourDimension.width + gap * 2,
        height: FourDimension.height + gap * 2
    }

    hamster = entityHelper.handleEntitiesChanges(hamster, Immutable.fromJS({
        ids,
        operations: lodash.reduce(packageDimensionWithGap, (accu, v, k) => {
            accu['data.props.'.concat(k)] = miaow.replaceAs(v)
            return accu;
        }, {})
    }))

    return hamster;
}

/**
 * 以leafids更新groupId的block四维
 * @param {*} hamster 
 * @param {*} leafIds 
 * @param {*} groupId 
 */
export function updateGroupFourDimension (hamster, leafIds, groupId) {
    const packageFourDimension = getPackageFourDimension(hamster, leafIds);
    hamster = updateBlockFourDimension(hamster, groupId, Immutable.fromJS(packageFourDimension));

    // 扩大一点,留点间隙
    hamster = stretchBlock(hamster, groupId, 5);
    return hamster;
}

/**
 * 钉住一个点
 * @description 坐标原点位于左上角
 * @param {Object} fourDimension 四维
 * @param {Object} offset 偏移 {width, height}
 * @param {*} point 钉子的坐标  String | Object
 * @returns {plainObject}
 */
const pointToCoordinate = {
    'nw': [0, 0],
    'sw': [0, 1],
    'ne': [1, 0],
    'se': [1, 1],
    'n': [0.5, 0],
    's': [0.5, 1],
    'e': [1, 0.5],
    'w': [0, 0.5]
}
export const pin = point => offset => fourDimension => {
    // 钉子的坐标
    const pinCoordinate = lodash.isString(point) ? pointToCoordinate[point] : point;

    return {
        ...fourDimension,
        width: fourDimension.width + offset.width,
        height: fourDimension.height + offset.height,
        left: fourDimension.left - offset.width * pinCoordinate[0],
        top: fourDimension.top - offset.height * pinCoordinate[1]
    };
}

/**
 * 坐标原点位于中心
 * @param {*} oldFourDimension
 * @param {*} newFourDimension
 * @param {*} point 
 * @returns {Array} [x, y]
 */
const pointToCoordinateC = {
    'nw': [-1, -1],
    'sw': [-1, 1],
    'ne': [1, -1],
    'se': [1, 1],
    'n': [0, -1],
    's': [0, 1],
    'e': [1, 0],
    'w': [-1, 0]
}
// length * 0.5是单位元
const getCoord = length => radio => length * 0.5 * radio;
export const samePointDifferenceVector = oldFourDimension=> newFourDimension=> point => {
    // 相同点的坐标
    const pinCoordinate = lodash.isString(point) ? pointToCoordinateC[point] : point;

    const newCoord = [
        getCoord(newFourDimension.width)(pinCoordinate[0]),
        getCoord(newFourDimension.height)(pinCoordinate[1])
    ]

    const oldCoord = [
        getCoord(oldFourDimension.width)(pinCoordinate[0]),
        getCoord(oldFourDimension.height)(pinCoordinate[1])
    ]

    const vector = lodash.flow(
        lodash.zip,
        miaow.map(
            arr => [arr[0] - arr[1]]
        )
    )(newCoord, oldCoord)

    return vector
}

// /**
//  * 升级为群组,即叶子节点
//  * @param {*} hamster 
//  * @param {*} id 祖先节点
//  */
// export const toCluster = hamster => ids => lodash.flow(
//     currentHelper.getExceptLeafs(hamster),
//     miaow.map(
//         miaow.dispatchMission(
//             miaow.prevCheck(nodeHelper.isAncestor(hamster))(nodeHelper.getAllLeafIds(hamster)),
//             miaow.identity
//         )
//     )
// )(miaow.toList(ids))

/**
 * 转坐标转换
 * @param {Object} coord 坐标
 * @param {Number} angle 坐标系旋转角，角度
 */
export function coordTransformation (coord, angle) {
    const radian = angle * Math.PI / 180;

    const [x, y] = coord;

    const x1 = x * Math.cos(radian) + y * Math.sin(radian);
    const y1 = -x * Math.sin(radian) + y * Math.cos(radian);

    return [Number(x1.toFixed(2)), Number(y1.toFixed(2))]
}
