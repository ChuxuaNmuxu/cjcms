import {Map} from 'immutable';

import * as miaow from './miaow'
import {createEntity, extractEntityProps} from './entity'

/**
 * 创建block元素
 */
const createBlock = (blockConfig) => {
    let data = (blockConfig.get('data') || Map()).merge({
        type: blockConfig.get('name'),
        props: extractEntityProps(blockConfig)
    });

    return createEntity('block', data);
}

/**
 * 获取block的中心偏移
 * @param {*} block 
 * @param {Object} rotateHandleOffset 旋转把手的坐标
 * @param {num} rotateRadius 旋转半径
 * @return {Object} {x, y}
 */
export const ROTATE_HANDLE_LENGTH = 18;
export const getBlockCenterOffset = (block, rotateHandleOffset, rotateRadius) => {
    const rotation = block.getIn(['data', 'props', 'rotation']) || 0;
    const blockHeight = block.getIn(['data', 'props', 'height']);

    // 旋转半径
    // TODO: 轴高+旋转点半径为一个常量，不需要动态取
    rotateRadius = rotateRadius || (blockHeight / 2 + ROTATE_HANDLE_LENGTH);
    rotateRadius = Number(rotateRadius.toFixed(2))

    const blockCenterClientOffset = {
        x: rotateHandleOffset.x - rotateRadius * Math.sin(rotation * Math.PI / 180),
        y: rotateHandleOffset.y + rotateRadius * Math.cos(rotation * Math.PI / 180)
    }

    return blockCenterClientOffset;
}

/**
 * 获取旋转角度
 * @param {*} block 
 * @param {*} initialClientOffset 
 * @param {*} endClientOffset 
 * @param {*} rotateRadius 
 */
export const getRotateAngle = (block, initialClientOffset, endClientOffset, rotateRadius) => {
    const blockCenterClientOffset = getBlockCenterOffset(block, initialClientOffset, rotateRadius)

    const rotateAngle = miaow.getAngleByThreeCoord.apply(null, [blockCenterClientOffset, initialClientOffset, endClientOffset].map(miaow.getCoord));

    return rotateAngle
} 

/**
 * 获取block的type，block.type对应于配置的config.name
 * 结合configManager.getBlock获取block配置
 * @param {*} block 来自reducer的数据
 */
export const getBlockType = block => block.getIn(['data', 'type']);

export {
    createBlock // 创建block元素
}
