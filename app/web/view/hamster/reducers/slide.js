import Immutable from 'immutable';

import initialState from './initialState';
import * as helper from './helper/helper';
import * as miaow from '../Utils/miaow';
import * as currentHelper from './helper/current'
import slideHelper from './helper/slide'

/**
 * 添加slides
 * 1. 添加到entities
 * 2. 添加到index，需要位置
 * 3. 添加到group，需要groupId
 * 4. 修改current，取第一个
 * 5. 修改selected，所有
 * @param {*} hamster 
 * @param {*} slides 
 * @param {*} param2 
 */
function addSlides (hamster, slides, {index, groupId}) {
    const slideIds = slides.map(slide => slide.get('id'))
    return hamster.withMutations(hamster => {
        // 添加到entities
        hamster.update(
            'entities',
            entities => slides.reduce(
                (acc, slide) => entities.set(slide.get('id'), slide),
                entities
            )
        );
        // 添加到index，需要位置
        hamster.updateIn(
            ['index', 'slides'],
            slides => slides.splice(index, 0, ...slideIds)
        )
        // 添加到group，需要groupId
        hamster.updateIn(
            ['entities', groupId, 'data', 'slides'],
            slides => slides.concat(slideIds)
        )
        // 修改current，取第一个
        hamster.update(
            'current',
            current => current.set('slide', slideIds.get(0)).set('slide.group', groupId)
        )
        // 修改selected，所有
        // hamster.update(
        //     ['current', 'selectedSlideIds'],
        //     ids => ids.clear().concat(slideIds)
        // )
    })
}

/**
 * 从之前的环节中找最后一个卡片，直到找到为止
 * @param {*} courseware 课件数据
 * @param {*} linkIndex 基准环节序号
 */
const getLastSlideFromBeforeGroup = (hamster, groupId) => {
    const groupIndex = hamster.getIn(['index', 'slide.groups']).findIndex(v => v === groupId)
    if (groupIndex < 1) {
        return null;
    }
    let idxes;
    let prevGroupIndex = groupIndex - 1;
    do {
        idxes = slideHelper.getSlideIdxesByGroupIndex(hamster, prevGroupIndex);
        prevGroupIndex--;
    } while (!idxes.size && prevGroupIndex >= 0);
    if (idxes.size) {
        return idxes.max();
    }
    return null;
}

function handleAddSlide (hamster, action) {
    const {payload: {slides, target: {target, targetId, position}}} = action;
    let index;
    let groupId;
    if (target === 'slide') {
        // 目标为slide，可加在slide之前或之后，所属组与目标所属组一致
        const targetIndex = hamster.getIn(['index', 'slides']).findIndex(id => id === targetId)
        index = targetIndex + Number(position === 'after');
        groupId = slideHelper.getGroupIdBySlideId(hamster, targetId);
    } else if (target === 'slide.group') {
        // 目标为slide.group，可加在组内的第一个或最后一个位置，所属组就是目标
        groupId = targetId;
        let idxes = slideHelper.getSlideIdxesByGroupId(hamster, groupId)
        if (idxes.size) {
            index = position === 'first' ? idxes.min() : idxes.max() + 1;
        } else {
            // 没有怎么办？往前找
            const prevLastSlideIndex = getLastSlideFromBeforeGroup(hamster, groupId);
            index = prevLastSlideIndex === null ? 0 : prevLastSlideIndex + 1
        }
    } else {
        /// 其它目标，可加在全局第一个或最后一个位置，所属组对应的也是第一个或最后一个
        if (position === 'first') {
            index = 0;
            groupId = hamster.getIn(['index', 'slide.groups', 0, 'id'])
        } else {
            index = hamster.getIn(['index', 'slides']).keySeq().last() + 1;
            groupId = hamster.getIn(['index', 'slide.groups']).last()
        }
    }
    return addSlides(hamster, slides, {
        index,
        groupId
    })
}

function addSlideGroup (hamster, {slideGroup, index}) {
    const groupId = slideGroup.get('id');
    return hamster.withMutations(hamster => {
        hamster.setIn(
            ['entities', groupId],
            slideGroup
        )
        hamster.updateIn(
            ['index', 'slide.groups'],
            groups => groups.splice(index, 0, groupId)
        )
        // 更新current
        hamster.setIn(
            ['current', 'slide.group'],
            groupId
        )
    })
}

function handleAddSlideGroup (hamster, action) {
    let {payload: {slideGroup, target: {target, targetId, position}}} = action;
    let index;
    if (target === 'slide') {
        // 组内目标及之后的卡片都放到新组里
        // 找出组内目标及之后的卡片
        const groupId = slideHelper.getGroupIdBySlideId(hamster, targetId);
        const idxes = slideHelper.getSlideIdxesByGroupId(hamster, groupId)
        const targetIndex = hamster.getIn(['index', 'slides']).findIndex(id => targetId === id);
        const slideIds = hamster.getIn(['index', 'slides']).slice(targetIndex, idxes.max() + 1)
        // 从原来移出
        hamster = hamster.updateIn(
            ['entities', groupId, 'data', 'slides'],
            slides => slides.filterNot(id => slideIds.includes(id))
        )
        // 加到新group里
        slideGroup = slideGroup.setIn(['data', 'slides'], slideIds);
        index = hamster.getIn(['index', 'slide.groups']).findIndex(id => id === groupId) + 1;
    } else if (target === 'slide.group') {
        // 之前或之后
        const targetIndex = hamster.getIn(['index', 'slide.groups']).findIndex(id => id === targetId)
        index = targetIndex + Number(position === 'after');
    } else {
        // 加到第一个或加到最后一个
        index = position === 'first' ? 0 : hamster.getIn(['index', 'slide.groups']).size;
    }
    
    return addSlideGroup(hamster, {slideGroup, index});
}

// 目标为slide
//      组内目标及之后的卡片都放到新组里
// 目标为group
    // 之前：加就行了
    // 之后：加就行了
// 目标为其它
    // first
    // last

function handleActivateSlide (hamster, action) {
    const {payload: slideIds} = action;
    // 修改current
    hamster = hamster.setIn(['current', 'slides'], slideIds)
    return hamster;
}

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : Immutable.fromJS(state)) : Immutable.fromJS(initialState)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

const slideType = type => 'SLIDE/' + type;

const slide = {
    [slideType('ADD')]: handleAddSlide,
    [slideType('ACTIVATE')]: handleActivateSlide,
    [slideType('ADD_GROUP')]: handleAddSlideGroup,
}

export default createReducer(initialState.hamster, slide);