import {fromJS, Map} from 'immutable'
import {createEntity, extractProps} from './entity'
import ConfigManager from '../manager/ConfigManager';

/**
 * 创建slide元素
 */
const createSlide = (slideConfig = null) => {
    slideConfig = slideConfig || ConfigManager.getSlideConfig();
    let data = (slideConfig.get('data') || Map()).merge({
        props: extractProps(slideConfig)
    });
    return createEntity('slide', data)
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