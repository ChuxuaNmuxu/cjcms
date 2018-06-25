import {fromJS} from 'immutable'
import {createEntity} from './entity'

/**
 * 创建slide元素
 */
const createSlide = () => {
    return createEntity('slide', fromJS({blocks: []}))
}

/**
 * 创建卡片组
 */
const createSlideGroup = () => {
    return createEntity('slide.group', fromJS({
        slides: []
    }))
}

export {
    createSlide,
    createSlideGroup
}