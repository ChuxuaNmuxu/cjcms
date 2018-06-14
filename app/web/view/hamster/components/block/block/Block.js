/**
 * 解析content的配置，做容器和元素组件的分配
 * @simiao
 * 20180425
 */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
// import CSSModules from 'react-css-modules';
// import classNames from 'classnames';
import {isFunction} from 'lodash';
import Immutable, { fromJS } from 'immutable';

// import styles from './Block.scss';
import configManager from '../../../manager/ConfigManager';
// import styleParser from '../block/decorator/style';
import Container from '../container';
import {dispatchMission, isValidateReactComponent} from '../../../Utils/miaow';
import blockActions from '../../../actions/block';
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

// @withHamster()
// @styleParser()
// @DragSource('block', spec, collect)
export class Component extends React.Component {
    static displayName = 'Block';

    static propTypes = {
        block: PropTypes.object,
        active: PropTypes.bool,
        // hamster: PropTypes.object,
        clickBlock: PropTypes.func
    }

    constructor(props, context) {
        super(props, context);
        
        const {block} = props;
        // 以type为依据的block的默认配置
        const blockConfig = configManager.getBlock(block.getIn(['data', 'type']));
        const contentConfig = blockConfig.get('content');
        const Block = dispatchMission(
                contentIsObject,
                contentIsComponent,
                someOthers
            )(contentConfig);

        this.state = {
            Block
        }
    }
    

    handleClick = (e) => {
        const {block, clickBlock} = this.props;
        const blockId = block.get('id');

        // hamster.blockManager.clickBlock({event: e, blockId});
        clickBlock && clickBlock({event: e, blockId});
    }

    render () {
        const {Block} = this.state;
        const props = {
            ...this.props,
            clickBlock: this.handleClick
        }

        // 先判断默认情况即是否是配置对象，否则为自定义
        return <Block {...props} />
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clickBlock: (payload) => dispatch(blockActions.click(payload))
    }
}

export default connect(null, mapDispatchToProps)(Component);
// CSSModules(Component, styles, {allowMultiple: true})
