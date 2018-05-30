import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DragLayer from '../block/decorator/operation/drag/DragLayer'

@DragLayer((monitor, props) => ({
    initialOffset: monitor.getInitialClientOffset(),
    offset: monitor.getOffset(),
    isDragging: monitor.isDragging()
}))
class CustomDragLayer extends Component {
    static propTypes = {
        isDragging: PropTypes.bool,
        offset: PropTypes.object
    }

    render() {
        if (!this.props.isDragging) return null

        return (
            <div>
                {this.props.offset.x}
            </div>
        )
    }
}

export default CustomDragLayer;
