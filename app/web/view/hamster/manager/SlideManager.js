import {fromJS, Map} from 'immutable'
import uuid from 'uuid';

import HamsterManager from './HamsterManager';
import slideActions from '../actions/slide';
import {getActivatedSlideIds} from '../reducers/helper/current'
import {createSlide, createSlideGroup} from '../utils/slide'

class SlideManager extends HamsterManager {
    /**
     * 添加
     */
    addSlide (slide, target) {
        if (!slide) {
            slide = createSlide();
        }
        this.addSlides([slide], target);
    }

    /**
     * 添加多个
     */
    addSlides (slides, target) {
        slides = fromJS(slides);
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

    // ------group------
    addSlideGroup (slideGroup, target) {
        if (!slideGroup) {
            slideGroup = createSlideGroup();
        }
        this.dispatch(slideActions.addGroup({slideGroup, target}));
    }
}

export default SlideManager
