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

    // canDrag (props, monitor, component) {
    //     const {block} = props;
    //     const blockId = block.get('id');
    //     const activatedId = props.hamster.getActivatedBlockIds();
        
    //     return activatedId.includes(blockId);
    // },

    endDrag (props, monitor, component) {
        const {x: left, y: top} = monitor.getOffset();

        props.hamster.blockManager.dragEnd(fromJS({
            offset: {left, top},
            blockId: props.block.get('id')
        }));
    }
}

const collect = (monitor, connect) => {
    return {
        monitor,
        dragSource: connect.dragSource()
    }
}

@DragSource('block', spec, collect)
@CSSModules(styles)
class DragSection extends Component {

    static displayName = 'DragSection'

    static propTypes = {
        dragSource: PropTypes.func
    }

    render() {
        const {dragSource} = this.props;

        return (
            dragSource(<div styleName='drag-wrap' className='drag-wrap' />)
        )
    }
}

export default DragSection;
