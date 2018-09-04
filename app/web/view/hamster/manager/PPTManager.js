import HamsterManager from './HamsterManager';
import pptActions from '../actions/ppt';
import navActions from '../actions/nav';
import slideActions from '../actions/slide';
import {block} from '../reducers/block/block'
import { fromJS } from 'immutable';

import { dispatchMission, prevCheck } from '../utils/miaow';
import {eventHelper} from './helper';
import { FOCUSAREA_NAV, FOCUSAREA_VIEWPORT } from '../config/constants';
import { getCurrentState } from '../reducers/helper/current';

class EditorManager extends HamsterManager {
    pipeHamster = null;

    initEditor () {
        this.dispatch(pptActions.init())
    }
    
    // 事件绑定
    addEventListener () {
        this.hamster.on('beforeDrag', e => {
            console.log(14, event)
            console.log(15, e)
            // if (e.ctrlKey) {
                // 复制
                console.log('copy')
            // }
        })

        document.addEventListener('keydown', event => {
            // console.log('event key:', event.key)
            const focusArea = getCurrentState(this.hamster.getHamsterState())('focusArea');

            dispatchMission(
                // navbar 事件
                prevCheck(() => focusArea === FOCUSAREA_NAV)(dispatchMission(
                    // TODO:
                    // eventHelper.onNavDeleteKey,
                    // eventHelper.onNavCopy,
                )),
                // block 事件
                prevCheck(() => focusArea === FOCUSAREA_VIEWPORT)(
                    dispatchMission(
                        eventHelper.onDeleteKey,
                        eventHelper.onCopy,
                        eventHelper.onPaste,
                    )
                )
            )(event, this.hamster)
        })

        // document.addEventListener('paste', event => console.log(267393))

        this.hamster.on('nav:mousedown', e => {
            e.stopPropagation();
            this.dispatch(navActions.mousedown())
        })

        // this.hamster.on('viewport:mousedown', )
        this.hamster.on('viewport:mousedown', e => {
            /**
             * TODO:
             * 1. 在block mousedown时保存activatedBlock, 在drag等的时候已保存的block来查找应该操作的block
             * 2. e.target方式组织冒泡用classList来做判断的方式需要优化
            */
            if (e.target.classList.contains('reveal') || e.target.classList.contains('slide-wrap')) {
                this.dispatch(slideActions.slideMouseDown());
            }
        })

        this.hamster.on('viewportPaste', e => {
            console.log(e.clipboardData)
        })

        // TODO: nav:paste

        this.hamster.on('exhibition:mousedown', e => {
            // console.log(36, e.target)
        })
    }

    getHamsterState () {
        return this.getState().hamster
    }

    // 建立管道，缓存hamster，为链式调用准备
    // pipe () {
    //     if (this.pipeHamster === null) {
    //         this.pipeHamster = this.getHamsterState();
    //     }
    // }

    // 将hamster合并到reduce
    finally () {
        if (this.pipeHamster === null) return;

        // dispatch将hamster合并到reduce的action
        this.dispatch(pptActions.saveData(fromJS({hamster: this.pipeHamster})))
        this.pipeHamster = null;
    }

    /**
     * 链式调用统一处理函数，将reduce函数纳入管道处理
     * @param {function}
     */
    pipe (func) {
        // 缓存hamster
        if (this.pipeHamster === null) {
            this.pipeHamster = this.getHamsterState();
        }

        // 调用reduce函数
        return payload => func.apply(null, [this.pipeHamster].concat({payload}));
    }

    deleteBlocks (ids) {
        this.pipeHamster = this.pipe(block.BLOCK_DELETE)(ids);
        return this;
    }

    addBlocks (blocks) {
        this.pipeHamster = this.pipe(block.ADD)({blocks});
        return this;
    }
}

export default EditorManager
