import {List, fromJS} from 'immutable'
import lodash from 'lodash'

import {getEntitiesByType} from './entity'
import * as currentHelper from './current';
import * as blockHelper from './block';
import * as miaow from '../../utils/miaow';
import registry from '../../manager/Registry'
import * as nodeHelper from './node';

/**
 * 根据 slide id 数组获取 slide index 数组
 * @param {*} hamster 
 * @param {*} slideIds 
 */
export const getSlideIdxesBySlideIds = (hamster, slideIds) => {
    return slideIds.size ? hamster.getIn(
        ['index', 'slides']
    ).toKeyedSeq()
    .filter(
        (slideId, index) => slideIds.includes(slideId)
    ).keySeq()
    .toList() : List();
}

/**
 * 获取group内的 slide index 数组
 * @param {*} hamster 
 * @param {*} groupId 
 */
export const getSlideIdxesByGroupId = (hamster, groupId) => {
    const slideIds = hamster.getIn(['entities', groupId, 'data', 'slides']);
    return getSlideIdxesBySlideIds(hamster, slideIds);
}

export const getSlideIdxesByGroupIndex = (hamster, groupIndex) => {
    const groupId = hamster.getIn(['index', 'slide.groups', groupIndex]);
    return getSlideIdxesByGroupId(hamster, groupId);
}

/**
 * 获取slide.group实体集
 * @param {*} hamster 
 */
export const getGroups = (hamster) => {
    return getEntitiesByType(hamster, 'slide.groups')
}

/**
 * 获取slide所属的卡片组
 * @param {*} hamster 
 * @param {*} slideId 
 */
export const getGroupBySlideId = (hamster, slideId) => {
    return getGroups(hamster).find(item => item.getIn(['data', 'slides']).includes(slideId))
}

/**
 * 获取slide所属的卡片组的id
 * @param {*} hamster 
 * @param {*} slideId 
 */
export const getGroupIdBySlideId = (hamster, slideId) => {
    return getGroupBySlideId(hamster, slideId).get('id');
}

/**
 * TODO:
 * 移到entity
 * @param {*} hamster 
 * @param {*} param1 
 */
export const getEntityByIndex = (hamster, {index = 0, type}) => {
    index = index === 'first' ? 0 : index === 'last' ? -1 : index;
    return hamster.getIn(['entities', hamster.getIn(['index', type]).get(index)]);
}

export const getSlideByIndex = (hamster, index) => {
    return getEntityByIndex(hamster, {type: 'slides', index});
}

export const getSlideGroupByIndex = (hamster, index) => {
    return getEntityByIndex(hamster, {type: 'slide.groups', index});
}

/**
 * 对齐
 * @param {*} hamster 
 * @param {*} ids 
 * @param {*} type
 */
// 简化逻辑的函数
const getGraduation = (dimension, x, y, z) => {
    if (!dimension) return [];

    console.log(96, dimension)

    let [a, b, c] = []
    if (miaow.isMap(dimension)) {
        [a, b, c] = [
            dimension.get(x),
            dimension.get(y),
            dimension.get(z)
        ];
    } else {
        [a, b, c] = [
            dimension[x],
            dimension[y],
            dimension[z]
        ];
    }

    if (lodash.isNaN(a + b + c)) return [];
    return [a, a + 0.5 * b, c];
};
const getXGraduation = dimension => getGraduation(dimension, 'left', 'width', 'right');
const getYGraduation = dimension => getGraduation(dimension, 'top', 'height', 'bottom');

const getConfigGrad = (len, gap) => lodash.uniq(lodash.range(0, len, gap).concat(len));

const spare = 5;

const getSnap = (graduations, ruler) => ruler.map(v => lodash.find(graduations, grad => v >= grad - spare && v <= grad + spare))

export const snap = (hamster, ids) => {
    const allBlocks = currentHelper.getAllBlockIdsInOperatingSlide(hamster);

    // 被操作元素六维
    const operateDimension = blockHelper.packageBlocks(hamster)(ids);

    // 被操作元素的刻度
    const [operateX, operateY] = lodash.over([getXGraduation, getYGraduation])(operateDimension);

    // 余下元素
    // 孤立节点 + 祖先节点之下的所有叶子节点
    const blockCluster = currentHelper.getIdCluster(hamster, ids);
    // 合入祖先元素
    const allSelectedBlocks = blockCluster.merge(ids);
    const remainBlocks = miaow.minus(allSelectedBlocks)(allBlocks);
    // 去除祖先元素
    const remainLeafBlocks = nodeHelper.filtAncestorIds(hamster)(remainBlocks)

    let [remainX, remainY] = [[], []];
    if (remainLeafBlocks.size > 0) {
        // 余下元素在x, y轴刻度
        const remainSixDimension = remainLeafBlocks.map(blockHelper.packageBlocks(hamster));
        // const remainX = lodash.flatten(remainSixDimension.map(({left, width, right}) => [left, left + 0.5 * width, right]));
        // const remainY = lodash.flatten(remainSixDimension.map(({top, height, bottom}) => [top, top + 0.5 * height, bottom]));
        [remainX, remainY] = lodash.flow(
            lodash.over([
                miaow.map(getXGraduation),
                miaow.map(getYGraduation)
            ]),
            miaow.map(lodash.flow(
                lodash.flatten,
                lodash.uniq
            ))
        )(remainSixDimension.toJS());
    }

    // 配置中x, y轴刻度
    // slide的宽高
    const {width: slideWidth, height: slideHeight} = registry.getContainer('slide')

    const [xGap, yGap] = lodash.flow(
        lodash.over(
            miaow.map(
                v => miaow.dispatchMission(
                    miaow.prevCheck(miaow.not(miaow.existy))(miaow.always('100%')),
                    miaow.get(`${v}.gap`),
                    miaow.get('gap'),
                    miaow.always('100%')
                )
            )(['x', 'y'])
        ),
        miaow.muiltyPipe(
            miaow.map(
                len => gap => /%/.test(gap)
                ? len / (Number(gap.replace('%', '')) / 100)
                : Number(gap)
            )([slideWidth, slideHeight])
        )
    )(hamster.getIn(['data', 'grid']))

    const configX = getConfigGrad(slideWidth, xGap);
    const configY = getConfigGrad(slideHeight, yGap);

    // 总的x, y刻度
    const x = lodash.sortedUniq(remainX.concat(configX));
    const y = lodash.sortedUniq(remainY.concat(configY));

    /**
     * left <= x0 then x0 < right <= x1 then x0 < center < x1 
     * top <= y0 then y0 < bottom <= y1 then y0 < middle < y1 
    */
    const snap = {
        x: miaow.effect(getSnap(x, operateX)),
        y: miaow.effect(getSnap(y, operateY))
    }

    console.log('snap: ', snap)

    hamster = currentHelper.updateCurrent(hamster)('data.snap')(fromJS(snap));

    return hamster;
}
