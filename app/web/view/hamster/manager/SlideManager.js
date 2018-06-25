import {fromJS, Map} from 'immutable'
import uuid from 'uuid';

import HamsterManager from './HamsterManager';
import slideActions from '../actions/slide';
import {getActivatedSlideIds} from '../reducers/helper/current'
import slideHelper from '../reducers/helper/slide'
import {
    createSlide,
    createSlideGroup,
} from '../utils/slide'

class SlideManager extends HamsterManager {
    /**
     * 添加卡片
     * @param {*} slide 卡片实体，可不传
     * @param {*} target 目标位置
     */
    addSlide (slide, target) {
        if (!slide) {
            slide = createSlide();
        }
        this.addSlides([slide], target);
    }

    /**
     * 添加多个
     * @param {*} slides 卡片实体列表，可不传
     * @param {*} target 目标位置
     */
    addSlides (slides, target) {
        slides = fromJS(slides || []);
        this.dispatch(slideActions.add({slides, target}));
    }

    /**
     * 激活blocks
     * @param {*} blockIds
     */
    activateSlide (slideIds) {
        this.dispatch(slideActions.activate({slideIds}))
    }

    getActivatedSlideIds () {
        return getActivatedSlideIds(this.getState('hamster'))
    }

    isFirstSlide (slideId) {
        const hamster = this.getState('hamster');
        return slideHelper.getSlideByIndex(hamster, 0).get('id') === slideId;
    }
    
    isLastSlide (slideId) {
        const hamster = this.getState('hamster');
        return slideHelper.getSlideByIndex(hamster, 'last').get('id') === slideId;
    }

    // ------group------
    addSlideGroup (slideGroup, target) {
        if (!slideGroup) {
            slideGroup = createSlideGroup();
        }
        this.dispatch(slideActions.addGroup({slideGroup, target}));
    }

    isFirstSlideGroup (groupId) {
        const hamster = this.getState('hamster');
        return slideHelper.getSlideGroupByIndex(hamster, 0).get('id') === groupId;
    }

    isLastSlideGroup (groupId) {
        const hamster = this.getState('hamster');
        return slideHelper.getSlideGroupByIndex(hamster, 'last').get('id') === groupId;
    }
}

export default SlideManager
