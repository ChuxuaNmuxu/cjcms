import React from 'react';
import BlockUtils from './Utils/BlockUtils';

export const HamsterContext = React.createContext();

/**
 * 集中处理类，将hamster注入组件中
 * 1. 初始化配置
 */
class Hamster {
    configResolve; // 配置处理器
    
    constructor (store) {
        // redux store
        this.store = store;
        this.dispatch = BlockUtils.dispatch = store.dispatch;
    }

    /**
     * 添加
     */
    addBlock (block) {
        BlockUtils.addBlocks([block]);
    }

    // /**
    //  * 拖拽管理类
    // */
    // setDragDropManager (store) {
    //     if (this.DragDropManager) return ;
    //     this.DragDropManager = new DragDropManager(store);
    // }

    // getDragDropManager () {
    //     return this.DragDropManager;
    // }

    getState () {
        return this.store.getState();
    }

    getActivedBlockIds () {
        return this.getState().hamster.getIn(['current', 'blocks'])
    }

}

export default Hamster;
