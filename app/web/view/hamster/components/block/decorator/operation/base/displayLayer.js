import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import {isEqual} from 'lodash'

import Manager from '../coreOperation/Manager'

export default function displayLayerFactory (Manager) {
    const DisplayLayer = (collect, options={}) => DecoratedComponent => {
        const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

        class Layer extends Component {
            static displayName = 'DisplayLayer' + displayName;

            constructor(props, context) {
                super(props, context);
                
                this.manager = Manager;
                this.monitor = Manager.getMonitor()
                this.state = this.getCurrentState();
            }

            componentDidMount () {
				this.unsubscribeFromOffsetChange = this.monitor.subscribeToOffsetChange(
					this.handleChange,
				)

                this.unsubscribeFromStateChange = this.monitor.subscribeToStateChange(
                    this.handleChange
                )

                this.handleChange();
            }

            componentWillUnmount () {
                this.unsubscribeFromOffsetChange();
                this.unsubscribeFromStateChange();
            }

            handleChange = () => {
                const state = this.getCurrentState();
                if (isEqual(state, this.state)) return;
                this.setState({
                    ...state
                })
            }
            getCurrentState = () => {
                return collect && collect(
                    this.monitor,
                    this.props
                );
            }

            render() {
                return (
                    <DecoratedComponent 
                      {...this.state}
                      {...this.props}
                      ref={node => {this.node = node}}
                    />
                )
            }
        }

        return hoistStatics(Layer, DecoratedComponent)
    }

    return DisplayLayer;
} 

export const displayLayer = displayLayerFactory(Manager)
