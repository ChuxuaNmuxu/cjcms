import {fromJS} from 'immutable'
import {createEntity} from './entity'

/**
 * 创建slide元素
 */
const createSlide = () => {
    return createEntity('slide', fromJS({}))
}

export {
    createSlide
}