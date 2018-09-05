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

        // 键盘事件监听
        document.addEventListener('keydown', event => {
            // console.log('event key:', event.key)
            const focusArea = getCurrentState(this.hamster.getHamsterState())('focusArea');

            /**
             * 按下delete可能是删导航栏卡片，也可能是删block
             * FOCUSAREA_NAV 导航栏区域点击，block取消激活，导航卡片取消激活
             * FOCUSAREA_VIEWPORT 视图区点击，block取消激活，导航卡片不变
             * 
            */
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

        /**
         * TODO: draggable = true的dom元素上绑定的onCopy和onPaste事件无法触发，
         * 所以直接绑定到document，在整个编辑器内触发粘贴事件，都将粘贴元素到编辑区
         * */
        // document.addEventListener('paste', event => console.log(267393))

        // TODO: nav:paste

        this.hamster.on('nav:mousedown', e => {
            e.stopPropagation();
            this.dispatch(navActions.mousedown())
        })

        // this.hamster.on('viewport:mousedown', )
        this.hamster.on('viewport:mousedown', e => {
            /**
             * TODO: 在点击block时会触发viewport:mousedown，因为没有阻止冒泡，
             * 其一因为用户自定义的block可能并不需要阻止冒泡，其二，react封装事件的e.stopPropagation()阻止不了原生事件的冒泡
             * 目前有两个方案：
             * 1. 在block mousedown时保存activatedBlock, 在drag等的时候已保存的block来查找应该操作的block
             * 2. e.target方式阻止冒泡用classList来做判断的方式需要优化
            */
            if (e.target.classList.contains('reveal') || e.target.classList.contains('slide-wrap')) {
                this.dispatch(slideActions.slideMouseDown());
            }
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
