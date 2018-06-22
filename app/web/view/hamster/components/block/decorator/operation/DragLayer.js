import React from 'react';
import hoistNonReactStatics  from 'hoist-non-react-statics'

import manager from './coreOperation/Manager';

const DragLayer = (collect, options) => DecoratedComponent => {
    class DragLayerContainer extends React.Component {
        constructor(props, context) {
            super(props, context);
            
            this.manager = manager;
            this.monitor = this.manager.getMonitor();

            this.state = {};
        }
        
        componentDidMount () {
            this.unSubscribeToStateChange = this.monitor.subscribeToStateChange(this.handleChange);
            this.unSubscribeToOffsetChange = this.monitor.subscribeToOffsetChange(this.handleChange);

            this.handleChange()
        }

        componentWillUnmount () {
            this.unSubscribeToStateChange();
            this.unSubscribeToOffsetChange()
        }

        handleChange = () => {
            const currentState = collect(this.monitor, this.props);

            this.setState({
                ...currentState
            })
        }

        render () {
            return (
                <DecoratedComponent 
                    {...this.props}
                    {...this.state}
                />
            )
        }
    }

    return hoistNonReactStatics(DragLayerContainer, DecoratedComponent);
}

export default DragLayer;
