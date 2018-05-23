import {createSlide} from '../utils/slide'

/**
 * 初始化hamster数据
 * TODO：移到它该去的地方
 */
const initHamster = () => {
    const slide = createSlide();
    const slideId = slide.get('id')
    return {
        sources: {},
        index: {
            blocks: [],
            slides: [slideId]
        },
        entities: {
            [slideId]: slide
        },
        current: {
            blocks: [],
            slides: [slideId]
        }
    }
}

export default {
    hamster: initHamster()
};
