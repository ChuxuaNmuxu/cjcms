import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import styles from './DragSection.scss';
import {DragSource} from '../decorator/operation/drag';
import {fromJS} from 'immutable'
import {connect} from 'react-redux'

import blockActions from '../../../actions/block';

const spec = {
    beginDrag (props, monitor, component) {
        const {actStart} = props;
        actStart && actStart(fromJS({
            type: 'dragging'
        }))
    },

    // canDrag (props, monitor, component) {
    //     const {block} = props;
    //     const blockId = block.get('id');
    //     const activatedId = props.hamster.getActivatedBlockIds();
        
    //     return activatedId.includes(blockId);
    // },

    endDrag (props, monitor, component) {
        const {dragEnd, block} = props;
        const {x: left, y: top} = monitor.getOffset();

        dragEnd && dragEnd(fromJS({
            offset: {left, top},
            blockId: block.get('id')
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
        config: PropTypes.object,
        block: PropTypes.object,
        active: PropTypes.bool,
        hamster: PropTypes.object,
        clickBlock: PropTypes.func,
        dragSource: PropTypes.func,
        actStart: PropTypes.func,
        dragEnd: PropTypes.func
    }

    render() {
        const {dragSource} = this.props;

        return (
            dragSource(<div styleName='drag-wrap' className='drag-wrap' />)
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actStart: (payload) => dispatch(blockActions.actStart(payload)),
        dragEnd: (payload) => dispatch(blockActions.dragEnd(payload))
    }
}

export {DragSection}
export default connect(null, mapDispatchToProps)(DragSection);
