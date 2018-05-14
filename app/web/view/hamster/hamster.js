import React from 'react';
import BlockUtils from './Utils/BlockUtils';

export const HamsterContext = React.createContext();

/**
 * 集中处理类，将hamster注入组件中
 * 1. 初始化配置
 */
class Hamster {
    store; // redux store
    configResolve; // 配置处理器

    constructor (dispatch) {
        this.dispatch = BlockUtils.dispatch = dispatch;
    }

    /**
     * 添加
     */
    addBlock (block) {
        BlockUtils.addBlocks([block]);
    }
}

export default Hamster;
