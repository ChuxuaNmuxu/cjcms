import {fromJS, Map} from 'immutable'
import {createEntity, extractEntityProps} from './entity'
import ConfigManager from '../manager/ConfigManager';

/**
 * 创建slide元素
 */
const createSlide = (slideConfig = null) => {
    slideConfig = slideConfig || ConfigManager.getSlideConfig();
    let data = (slideConfig.get('data') || Map()).merge({
        props: extractEntityProps(slideConfig),
        blocks: []
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