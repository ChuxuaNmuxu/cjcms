import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rotateSource from '../decorator/operation/rotate';

const spec = {
    beginRotate: (props, monitor, component) => {
        console.log('beginRotate: ', monitor)
    },
    endRotate: (props, monitor, component) => {
        console.log('endRotate: ', props)
    }
}

const collect = (monitor, connector) => ({
    rotateSource: connector.connect(),
    canRotate: monitor.canRotate()
})


@rotateSource('container', spec, collect)
class RotatePin extends Component {
    static propTypes = {
        canRotate: PropTypes.bool,
        rotateSource: PropTypes.func
    }

    render() {
        const style = {
            width: '20px',
            height: '20px',
            background: 'violet',
            borderRadio: '50%',
            position: 'absolute',
            top: '30px',
            right: '20px'
        }

        const {rotateSource} = this.props;

        return (
            rotateSource(
                <div style={style}>
                    旋转吧，地球君
                </div>
            )
        )
    }
}

export default  RotatePin;
