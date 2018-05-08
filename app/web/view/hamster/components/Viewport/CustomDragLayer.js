import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragLayer } from '../block/decorator/drag'

@DragLayer((monitor, props) => ({
    monitor,
    props
}))
class CustomDragLayer extends Component {
    static propTypes = {
        monitor: PropTypes.object
    }

    render() {
        return (
            <div>
                layer
            </div>
        )
    }
}

export default CustomDragLayer;
