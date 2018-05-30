import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rotateSource from '../decorator/operation/rotate';
import CSSModules from 'react-css-modules'
import styles from './RotateSection.scss'

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
@CSSModules(styles)
class RotateSection extends Component {
    static displayName = 'RotateSection'

    static propTypes = {
        canRotate: PropTypes.bool,
        rotateSource: PropTypes.func
    }

    render() {
        const {rotateSource} = this.props;

        return (
            <div styleName='rotate-wrap' className='rotate-wrap'>
                    <div className="axle" />
                {
                    rotateSource(<div className="handle" />)
                }
                </div>
        )
    }
}

export default  RotateSection;
