/**
 * 解析content的配置，做容器和元素组件的分配
 * @simiao
 * 20180425
 */
import React from 'react';
import PropTypes from 'prop-types';
// import CSSModules from 'react-css-modules';
// import classNames from 'classnames';
import {isFunction, flowRight} from 'lodash';

import styles from './Block.scss';
import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils';
import blockPraser from '../block/decorator/blockParse';
import Container from '../block/container';
import {dispatchMission} from '../../Utils/miaow';
import Immutable from 'immutable';

const add = values => prop => {
    console.log('props: ', prop.concat(values))
    return prop.concat(values);
}

const deleteProps = values => props => props.filterNot(item => values.includes(item || item.get(id)));

const clear = props => props.clear();

const handleClick = (e, block) => {
    if (e.ctrlKey) {
        BlockUtils.activateBlock(add([block.get('id')]))
        return ;
    };
    BlockUtils.activateBlock(flowRight(add([block.get('id')]), clear));
}

// 其他情况
const someOthers = (error, props) => {
    return <Container {...props}>
        <div style={{color: 'red'}}>
            {`config not support yet, please check: ${error}`}
        </div>
    </Container>
}

// @config container: false 不需要容器
const noContainer = (config, props) => {
    if (config.get('container') !== false) return undefined;
    
    const ContentComponent = config.get('component');
    return <ContentComponent {...props} />
}

// @config container: object 配置容器
const containerConfigured = (config, props) => {
    const container = config.get('container');
    if (!Immutable.Map.isMap(container)) return undefined;

    const ContentComponent = config.get('component');
    return <Container {...props} >
        <ContentComponent {...props} />
    </Container>
}

// @config component: null 配置组件不存在的情况
const componentIsNull = (config, props) => {
    if (!config.get('component')) return someOthers('component is null', props);
} 

// @config object 配置对象
const contentIsObject = (config, props) => {
    if (!Immutable.Map.isMap(config)) return undefined;

    // 先校验component是否为null(这是默认配置，说明没有第三方自定义)，在处理容器的配置
    return dispatchMission(noContainer, containerConfigured, componentIsNull)(config, props);
}

// @config reactComponent 配置組件,默认有容器包裹
const contentIsComponent = (ContentComponent, props) => {
    // function or class
    if (!isFunction(ContentComponent)) return undefined;

    return <Container {...props}>
        <ContentComponent {...props} />
    </Container>
}

export const Component = (props) => {
    const {block} = props;
    const blockConfig = configHelper.getBlock(block.getIn(['data', 'type']));
    const contentConfig = blockConfig.get('content');

    // 先判断默认情况即是否是配置对象，否则为自定义
    return dispatchMission(someOthers, contentIsComponent, contentIsObject)(contentConfig, {...props, handleClick});

}

Component.propTypes = {
    block: PropTypes.any,
    active: PropTypes.bool
}

export default blockPraser()(
    Component
    // CSSModules(Component, styles, {allowMultiple: true})
);
