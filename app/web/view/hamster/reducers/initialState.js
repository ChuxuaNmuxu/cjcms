import uuid from 'uuid'
import {createSlide} from '../utils/slide'

/**
 * 初始化hamster数据
 * TODO：移到它该去的地方
 */
const initHamster = () => {
    const slide = createSlide();
    const slideId = slide.get('id')
    const slideGroupId = 'slide.group-' + uuid.v4();
    const slideGroup = {
        id: slideGroupId,
        type: 'slide.group',
        data: {
            slides: [slideId]
        }
    }
    return {
        sources: {},
        index: {
            blocks: [],
            slides: [slideId],
            'slide.groups': [slideGroupId]
        },
        entities: {
            [slideId]: slide,
            [slideGroupId]: slideGroup
        },
        current: {
            blocks: [],
            slides: [slideId],
            'slide.group': slideGroupId
        }
    }
}

export default {
    hamster: initHamster()
};
