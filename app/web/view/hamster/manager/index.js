import React from 'react';

import configManager from './ConfigManager';
import PPTManager from './PPTManager'
import EntityManager from './EntityManager'
import SourceManager from './SourceManager'
import StoreManager from './StoreManager'
import BlockManager from './BlockManager'
import SlideManager from './SlideManager'
import Subscriber from './Subscriber';
import registry from './Registry';

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
        this.pptManager = new PPTManager(this);
        this.entityManager = new EntityManager(this);
        this.sourceManager = new SourceManager(this);
        this.blockManager = new BlockManager(this);
        this.slideManager = new SlideManager(this);
        this.subscriber = new Subscriber(store);
        this.registry = registry;
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

    /**
     * 更新entities属性
     */
    changeEntitiesProps (ids, props) {
        this.entityManager.changeEntitiesProps(ids, props)
    }

    getSubscriber () {
        return this.subscriber;
    }

    /**
     * 获取容器
     * @param {*} name slide | reveal
     */
    getContainer (name) {
        return this.registry.getContainer(name)
    }
}

export default Hamster;
