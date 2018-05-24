import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import styles from './DragSection.scss';
import {DragSource} from '../decorator/operation/drag';
import {fromJS} from 'immutable'

const spec = {
    beginDrag (props, monitor, component) {
        console.log('beginDrag123: ', props)
    },

    endDrag (props, monitor, component) {
        const {x: left, y: top} = monitor.getOffset();

        const subscriber = props.hamster.getSubscriber();
        props.hamster.blockManager.moveBlocks(subscriber.getActivatedBlockIds(), fromJS({left, top}));
    }
}

const collect = (monitor, connect) => {
    return {
        monitor
    }
}

@DragSource('block', spec, collect)
@CSSModules(styles)
class DragSection extends Component {

    static displayName = 'DragSection'

    static propTypes = {
        prop: PropTypes
    }

    render() {
        return (
            <div styleName='drag-wrap' className='drag-wrap' />
        )
    }
}

export default DragSection;
