import React from 'react';
import ReactDOM from 'react-dom';
import {isValidateReactComponent} from '../../../../../Utils/miaow';
import DragDropManager from './core';
import createSource from './createSource';
import createMonitor from './createMonitor';
import handleConnect from './handleConnect';

const resizeSource = (type, spec, collect) => {
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

                this.monitorHandle = createMonitor(this.manager);
                this.sourceHandle = createSource(spec, this.monitorHandle);
                this.handleConnect = handleConnect(this.manager);

                this.sourceId = null;

                // 注册当前资源对象
                this.registry();

                this.sourceHandle.receiveProps(props);
                this.state = this.getCurrentState();
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

                // source
                this.sourceHandle.reveiveComponent(this.node);
                // 给node增加drag相关属性和事件监听
                // this.backend.connectSource(this.sourceId ,this.node);
                // 监听数据变化
                this.unsubscribe = this.monitor.subscribeToStateChange(this.handleChange);

                this.handleChange()
            }

            componentWillReceiveProps (nextProps) {
                this.sourceHandle.receiveProps(nextProps);
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

            registry () {
                // 注册source对象和monitor
                this.sourceId = this.register.addSource(this.sourceHandle);

                // 需要sourceId的对象
                this.monitorHandle.reveiveSourceId(this.sourceId);
                this.handleConnect.receiveId(this.sourceId)
            }

            receiveProps (props) {

            }

            getCurrentState () {
                return collect && collect(
                    this.handleConnect.connector,
                    this.monitorHandle
                );
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

export default resizeSource;
