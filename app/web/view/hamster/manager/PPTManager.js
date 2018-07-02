import HamsterManager from './HamsterManager';
import pptActions from '../actions/ppt'
import {block} from '../reducers/block/block'
import { fromJS } from 'immutable';

class EditorManager extends HamsterManager {
    pipeHamster = null;

    initEditor () {
        this.dispatch(pptActions.init())
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
