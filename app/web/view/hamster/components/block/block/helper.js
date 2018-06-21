/**
 * content配置解析
 * 只做浅解析，将container和component的配置派发，具体由各自组件在做解析
 * 1. content为ReactComponent
 * 2. content为对象，其中，component存在但container不存在的情况等同于content为content为ReactComponent
 */
import React from 'react'

import configManager from '../../../manager/ConfigManager';
import {dispatchMission, isValidateReactComponent, isMap} from '../../../Utils/miaow';
import Container from '../container';

// 其他情况
const someOthers = (error) => {
    return props => <Container config={true} {...props}>
        <div style={{color: 'red'}}>
            {`config not support yet, please check: ${error}`}
        </div>
    </Container>
}

// @config reactComponent 配置組件,默认有容器包裹
const contentIsComponent = (ContentComponent) => {
    // function or class
    if (!isValidateReactComponent(ContentComponent)) return undefined;

    return props => <Container config={true} {...props}>
        <ContentComponent {...props} />
    </Container>
}

// @config componentIsComponent
const componentIsComponent = (contentConfig) => {
    // function or class
    const ContentComponent = contentConfig.get('component');
    if (!isValidateReactComponent(ContentComponent)) return undefined;

    const containerConfig = config.get('container');
    if (!containerConfig) return contentIsComponent(ContentComponent)

    return props => <Container config={containerConfig} {...props}>
        <ContentComponent {...props} />
    </Container>
}

// @config component: null 配置组件不存在的情况
const componentIsNull = (contentConfig) => {
    if (contentConfig.get('component') !== null) return undefined;

    const containerConfig = config.get('container');
    return props => <Container config={containerConfig} {...props}/>
}

// @config object 配置对象
const contentIsObject = (contentConfig) => {
    if (!isMap(contentConfig)) return undefined;
        // 先校验component是否为null(这是默认配置，说明没有第三方自定义)，在处理容器的配置
    return dispatchMission(
        componentIsNull,
        componentIsComponent,
        someOthers
    )(contentConfig);
}

/**
 * 以type为依据的block的默认配置
 * @param block
 */
const getDefaultBlock = type => {
    if (!type) return;
    
    const blockConfig = configManager.getBlock(type);
    const contentConfig = blockConfig.get('content');

    return dispatchMission(
        contentIsComponent,
        contentIsObject,
        someOthers
    )(contentConfig);
}

export default getDefaultBlock;