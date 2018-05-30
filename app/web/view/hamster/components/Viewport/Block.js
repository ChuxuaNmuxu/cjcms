/**
 * 解析content的配置，做容器和元素组件的分配
 * @simiao
 * 20180425
 */
import React from 'react';
import PropTypes from 'prop-types';
// import CSSModules from 'react-css-modules';
// import classNames from 'classnames';
import {flowRight, isFunction} from 'lodash';

import styles from './Block.scss';
import configManager from '../../manager/ConfigManager';
// import styleParser from '../block/decorator/style';
import Container from '../block/container';
import {dispatchMission, isValidateReactComponent} from '../../Utils/miaow';
import Immutable, { fromJS } from 'immutable';
import {withHamster} from '../../hamster';
import defaultBlockConfig from '../../config/block'
const defaultContainerConfig = fromJS(defaultBlockConfig.content.container)

// 其他情况
const someOthers = (error, props) => {
    return <Container config={defaultContainerConfig} {...props}>
        <div style={{color: 'red'}}>
            {`config not support yet, please check: ${error}`}
        </div>
    </Container>
}

// @config container: function 自定义容器
const containerIsFunction = (config, props) => {
    const container = config.get('container');
    if (!isFunction(container)) return undefined;
    const ContainerComponent = container(config, props)

    const ContentComponent = config.get('component');
    return <ContainerComponent {...props} >
        <ContentComponent {...props} />
    </ContainerComponent>
}

// @config container: object 容器单项配置
const containerIsObject = (config, props) => {
    const container = config.get('container');
    if (!Immutable.Map.isMap(container)) return undefined;
    
    const ContentComponent = config.get('component');
    return <Container config={config} {...props} >
        <ContentComponent {...props} />
    </Container>
}

// @config container: false 不需要容器
const containerIsFalse = (config, props) => {
    if (config.get('container') !== false) return undefined;
    
    const ContentComponent = config.get('component');
    return <ContentComponent {...props} />
}

// @config container: true 默认容器
const containerIsTrue = (config, props) => {
    if (config.get('container') !== true) return undefined;

    const ContentComponent = config.get('component');
    return <Container config={defaultContainerConfig} {...props} >
        <ContentComponent {...props} />
    </Container>
}

// @config container: object 配置容器
const containerConfigured = (config, props) => {
    const container = config.get('container');
    if (!Immutable.Map.isMap(container)) return undefined;

    return dispatchMission(
        containerIsTrue,
        containerIsFalse,
        containerIsObject,
        containerIsFunction
    )(config, props);
}

// @config component: null 配置组件不存在的情况
const componentIsNull = (config, props) => {
    console.log('componentIsNull: ', config.toJS())

    if (!config.get('component')) return <Container config = {config} {...props}/>;
}

// @config object 配置对象
const contentIsObject = (config, props) => {
    if (!Immutable.Map.isMap(config)) return undefined;

    // 先校验component是否为null(这是默认配置，说明没有第三方自定义)，在处理容器的配置
    return dispatchMission(
        componentIsNull,
        containerConfigured
    )(config, props);
}

// @config reactComponent 配置組件,默认有容器包裹
const contentIsComponent = (ContentComponent, props) => {
    // function or class
    if (!isValidateReactComponent(ContentComponent)) return undefined;

    return <Container config={defaultContainerConfig} {...props}>
        <ContentComponent {...props} />
    </Container>
}

@withHamster()
// @styleParser()
// @DragSource('block', spec, collect)
class Component extends React.Component {
    static propTypes = {
        block: PropTypes.any,
        active: PropTypes.bool
    }

    handleClick = (e) => {
        const {hamster, block} = this.props;
        const blockId = block.get('id');
        hamster.blockManager.clickBlock({event: e, blockId});
    }

    render () {
        const {block} = this.props;
        const blockConfig = configManager.getBlock(block.getIn(['data', 'type']));
        const contentConfig = blockConfig.get('content');
        
        // 先判断默认情况即是否是配置对象，否则为自定义
        //TODO: 高阶组件不建议放在render中
        return dispatchMission(
            contentIsObject,
            contentIsComponent,
            someOthers
        )(contentConfig, {...this.props, handleClick: this.handleClick});
    }
}

export default Component;
// CSSModules(Component, styles, {allowMultiple: true})
