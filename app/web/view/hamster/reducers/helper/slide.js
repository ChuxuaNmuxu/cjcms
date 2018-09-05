import {List, fromJS} from 'immutable'
import lodash from 'lodash'

import {getEntitiesByType, getEntity} from './entity'
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
 * @description 分x, y两轴的计算，计算过程基本相同，所以将数据设计成[[x], [y]]数组，
 * 结合miaow.muiltyPipe(多线程，多参数)以及zip(双线程，双参数)，简化重复计算。
 */
// 简化逻辑的函数
const getGraduation = (dimension, x, y, z) => {
    if (!dimension) return List();
    
    const [a, b, c] = miaow.destruction(x, y, z)(dimension);
    
    if (lodash.isNaN(a + b + c)) return List();
    return List([a, a + 0.5 * b, c]);
};
const getXGraduation = dimension => getGraduation(dimension, 'left', 'width', 'right');
const getYGraduation = dimension => getGraduation(dimension, 'top', 'height', 'bottom');

// 获取单个block的刻度尺
// map -> List()
const getXYGraduation = miaow.overI([getXGraduation, getYGraduation]);

const getConfigGrad = len => gap => lodash.uniq(lodash.range(0, len, gap).concat(len));

const getGradById = hamster => lodash.flow(
    blockHelper.packageBlocks(hamster),
    fromJS,
    getXYGraduation,
);

const getGradByIds = hamster => blockIds => {
    blockIds = miaow.toList(blockIds);

    const id = blockIds.get(0);
    if (!id) return fromJS([[], []]);

    const tails = miaow.tails(blockIds);

    /**
     * @returns List([List, List])
     */
    const grad = getGradById(hamster)(id);

    return grad.zipWith((a, b) => a.concat(b), getGradByIds(hamster)(tails));
}

// 对齐刻度的冗余距离
const spare = 5;

const getSnap = (grads, ruler) => {
    if (ruler.size === 0) return List();

    let snap = List();
    let v = ruler.get(0);
    grads.forEach(grad => {
        // 最大值比完了，后面就不用再比了
        if (ruler.size === 0) return;

        if (miaow.existy(v) && v >= grad - spare && v <= grad + spare) {
            snap = snap.push(grad);
            ruler = miaow.tails(ruler);
            v = ruler.get(0);
        }
    })

    // 边界如[0], 在最小值比完之后还需要比较后面的值
    return miaow.cat(snap, getSnap(grads, miaow.tails(ruler)))
}

export const snap = (hamster, ids) => {
    const allBlocks = currentHelper.getAllBlockIdsInOperatingSlide(hamster);

    /**
     * 被操作元素的刻度尺
     * */
    const operateBlocksGrad = getGradById(hamster)(ids);

    /**
     * 余下元素
     * */
    // 孤立节点 + 祖先节点之下的所有叶子节点
    const blockCluster = currentHelper.getIdCluster(hamster, ids);
    // 合入祖先元素
    const allSelectedBlocks = blockCluster.merge(ids);
    const remainBlocks = miaow.minus(allSelectedBlocks)(allBlocks);
    // 去除祖先元素
    const remainLeafBlocks = nodeHelper.filtAncestorIds(hamster)(remainBlocks)

    /**
     * 余下元素在x, y轴刻度
     */
    const remainGrads = getGradByIds(hamster)(remainLeafBlocks)

    /**
     * 配置x, y轴刻度
     * */
    // slide的宽高
    const {width: slideWidth, height: slideHeight} = registry.getContainer('slide')

    const grid = hamster.getIn(['data', 'grid']);
    const configGrads = lodash.flow(
        miaow.overI(
            // gap: 网格间距
            miaow.map(
                v => miaow.dispatchMission(
                    miaow.prevCheck(miaow.not(miaow.identity))(miaow.always('100%')),
                    miaow.get(`${v}.gap`),
                    miaow.get('gap'),
                    miaow.always('100%')
                )
            )(['x', 'y'])
        ),
        // 将gap的百分比变成绝对距离
        miaow.muiltyPipe(
            miaow.map(
                len => gap => /%/.test(gap)
                ? len / (Number(gap.replace('%', '')) / 100)
                : Number(gap)
            )([slideWidth, slideHeight])
        ),
        // ppt.data.grid中的配置
        miaow.muiltyPipe([slideWidth, slideHeight].map(getConfigGrad)),
        fromJS
    )(grid);

    /**
     * 总的x, y刻度
     */
    const totalGrads = configGrads.zipWith(lodash.flow(miaow.cat, miaow.handle('sort'), miaow.uniq, miaow.effect), remainGrads);

    const snap = totalGrads.zipWith(getSnap, operateBlocksGrad)
    
    const [x, y] = miaow.destruction(0, 1)(snap)
    hamster = currentHelper.updateCurrent(hamster)('snap.data')(fromJS({x, y}));

    return hamster;
}

// 获取当前slide中的所有blocksId
export const getCurrentSlideBlockIds = hamster => lodash.flow(
    currentHelper.getCurrentState(hamster),
    getEntity(hamster),
    miaow.get('data.blocks')
)('operatingSlideId')

