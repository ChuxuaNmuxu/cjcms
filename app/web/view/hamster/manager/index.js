import React from 'react';

import configManager from './ConfigManager';
import EntityManager from './EntityManager'
import SourceManager from './SourceManager'
import StoreManager from './StoreManager'
import BlockManager from './BlockManager'
import Subscriber from './Subscriber';
import hamster from '.';

export const HamsterContext = React.createContext();

/**
 * 注入hamster
 */
export const withHamster = () => Component => {
    return props => (
        <HamsterContext.Consumer>
            { hamster => <Component {...props} hamster={hamster} /> }
        </HamsterContext.Consumer>
    )
}

/**
 * 集中处理类，将hamster注入组件中
 * 1. 初始化配置
 */
class Hamster extends StoreManager {
    configManager; // 配置管理器
    entityManager; // 实体管理器
    sourceManager; // 资源管理器
    
    constructor (store) {
        super(store);

        this.configManager = configManager;
        this.entityManager = new EntityManager(this);
        this.sourceManager = new SourceManager(this);
        this.blockManager = new BlockManager(this);
        this.subscriber = new Subscriber(store);
    }

    /**
     * 添加
     */
    addBlock (block) {
        this.blockManager.addBlock(block)
    }

    getActivatedBlockIds () {
        return this.blockManager.getActivatedBlockIds()
    }

    getSubscriber () {
        return this.subscriber;
    }
}

export default Hamster;
