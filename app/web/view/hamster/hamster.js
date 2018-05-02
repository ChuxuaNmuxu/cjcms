import React from 'react';

import BlockUtils from './Utils/BlockUtils';
import DragDropManager from './components/block/decorator/drag/core';

export const HamsterContext = React.createContext();

/**
 * 集中处理类，将hamster注入组件中
 * 1. 初始化配置
 */
class Hamster {
    constructor (dispatch) {
        this.dispatch = BlockUtils.dispatch = dispatch;
        this.DragDropManager = new DragDropManager();
    }

    /**
     * 添加
     */
    addBlock (block) {
        BlockUtils.addBlocks([block]);
    }

    /**
     * 拖拽管理
    */
    getDragDropManager () {
        return this.DragDropManager;
    }
}

export default Hamster;
