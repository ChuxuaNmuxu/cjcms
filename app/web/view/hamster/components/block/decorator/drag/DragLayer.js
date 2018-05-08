import DragDropManager from './core';
import React from 'react'


const DragLayer = (collect, options) => DecoratedComponent => {
    class DragLayerContainer extends React.Component {
        constructor(props, context) {
            super(props, context);
            
            this.manager = DragDropManager;
            this.monitor = DragDropManager.getMonitor();

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

        handleChange () {
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

    return DragLayerContainer;
}

export default DragLayer;
