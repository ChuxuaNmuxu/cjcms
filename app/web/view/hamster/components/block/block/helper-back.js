import React from 'react'
import {isFunction} from 'lodash';
import Immutable, { fromJS } from 'immutable';

import configManager from '../../../manager/ConfigManager';
import {dispatchMission, isValidateReactComponent} from '../../../Utils/miaow';
import Container from '../container';
import defaultBlockConfig from '../../../config/block'
const defaultContainerConfig = fromJS(defaultBlockConfig.content.container)

// 其他情况
const someOthers = (error) => {
    return props => <Container config={defaultContainerConfig} {...props}>
        <div style={{color: 'red'}}>
            {`config not support yet, please check: ${error}`}
        </div>
    </Container>
}

// @config container: function 自定义容器
const containerIsFunction = (config) => {
    const container = config.get('container');
    if (!isFunction(container)) return undefined;
    const ContainerComponent = container(config, props)

    const ContentComponent = config.get('component');
    return props => <ContainerComponent {...props} >
        <ContentComponent {...props} />
    </ContainerComponent>
}

// @config container: object 容器单项配置
const containerIsObject = (config) => {
    const container = config.get('container');
    if (!Immutable.Map.isMap(container)) return undefined;
    
    const ContentComponent = config.get('component');
    return props => <Container config={config} {...props} >
        <ContentComponent {...props} />
    </Container>
}

// @config container: false 不需要容器
const containerIsFalse = (config) => {
    if (config.get('container') !== false) return undefined;

    const ContentComponent = config.get('component');
    return props => <ContentComponent {...props} />
}

// @config container: true 默认容器
const containerIsTrue = (config) => {
    if (config.get('container') !== true) return undefined;

    const ContentComponent = config.get('component');
    return props => <Container config={defaultContainerConfig} {...props} >
        <ContentComponent {...props} />
    </Container>
}

// @config container: object 配置容器
const containerConfigured = (config) => {
    const container = config.get('container');
    if (!Immutable.Map.isMap(container)) return undefined;

    return dispatchMission(
        containerIsTrue,
        containerIsFalse,
        containerIsObject,
        containerIsFunction
    )(config);
}

// @config component: null 配置组件不存在的情况
const componentIsNull = (config) => {
    if (config.get('component') !== null) return undefined;
    return props => <Container config = {config} {...props}/>
}

// @config object 配置对象
const contentIsObject = (config) => {
    if (!Immutable.Map.isMap(config)) return undefined;
        // 先校验component是否为null(这是默认配置，说明没有第三方自定义)，在处理容器的配置
    return dispatchMission(
        componentIsNull,
        containerConfigured
    )(config);
}

// @config reactComponent 配置組件,默认有容器包裹
const contentIsComponent = (ContentComponent) => {
    // function or class
    if (!isValidateReactComponent(ContentComponent)) return undefined;

    return props => <Container config={defaultContainerConfig} {...props}>
        <ContentComponent {...props} />
    </Container>
}

/**
 * 以type为依据的block的默认配置
 * @param block
 */
const getDefaultBlock = block => {
    if (!block) return;
    
    const blockConfig = configManager.getBlock(block.getIn(['data', 'type']));
    const contentConfig = blockConfig.get('content');

    return dispatchMission(
        contentIsObject,
        contentIsComponent,
        someOthers
    )(contentConfig);
}

export default getDefaultBlock;
