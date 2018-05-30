import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DragLayer from '../block/decorator/operation/drag/DragLayer'

@DragLayer((monitor, props) => ({
    monitor
}))
class CustomDragLayer extends Component {
    static propTypes = {
        monitor: PropTypes.object
    }

    render() {
        const {monitor} = this.props;
        console.log('dragLayer: ', monitor)

        return (
            <div>
                layer
            </div>
        )
    }
}

export default CustomDragLayer;
