import React from 'react';
import ReactDOM from 'react-dom';
import Moniter from './core/Moniter';
import {isValidateReactComponent} from '../../../../Utils/miaow';
import DragDropManager from './core';

const DragSource = (type, spec, collect) => {
    // TODO: params check

    return DecoratedComponent => {
        // TODO: state = {monitor}
        return class extends React.Component {
            constructor(props, context) {
                super(props, context);
                
                this.manager = DragDropManager;
                this.monitor = this.manager.getMonitor();
                this.register = this.manager.getRegistry();
                this.backend = this.manager.backend;
                this.sourceId = null;
            }          

            validateNode () {
                const node = this.DecoratedComponentRef;
                // react 元素
                if (isValidateReactComponent(node)) return ReactDOM.findDOMNode(node);
                // dom节点
                return node;
            }

            componentDidMount () {
                this.node = this.validateNode();
                // 注册当前source
                this.registrySource();
                // 给node增加drag相关属性和事件监听
                this.backend.connectSource(this.sourceId ,this.node);
                // 监听数据变化
                this.unsubscribe = this.monitor.subscribeToStateChange(this.handleChange);
            }

            componentWillUnmount () {
                this.unsubscribe();
                this.register.unRegistry(this.sourceId);
            }

            handleChange = () => {
                const state = this.getCurrentState();
                this.setState({
                    ...state
                })
            }

            registrySource () {
                //TODO: 注册spe中的自定义事件
                // 接受props的变化
                // this.register.receiveProps(props);
                this.sourceId = this.register.addSource(spec);
            }

            getCurrentState () {
                return collect && collect(this.monitor);
            }
            
            render () {
                return <DecoratedComponent
                    {...this.props}
                    {...this.state}
                    ref = {e => this.DecoratedComponentRef = e}
                />
            }
        }
    }
}

export default DragSource;
