import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import styles from './DragSection.scss';
import {DragSource} from '../decorator/operation/drag';
import {fromJS} from 'immutable'
import {connect} from 'react-redux'

import blockActions from '../../../actions/block';
import { isValidateReactComponent } from '../../../Utils/miaow';

const spec = {
    beginDrag (props, component) {
        const {beginDrag, block} = props;
        beginDrag && beginDrag(fromJS({
            type: 'dragging',
            blockId: block.get('id')
        }))
    },

    drag (props, monitor) {
        const {drag, block} = props;
        const {x: left, y: top} = monitor.getOffset();
        drag && drag(fromJS({
            offset: {left, top},
            blockId: block.get('id')
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
class DragSection extends React.Component {
    static displayName = 'DragSection'

    static propTypes = {
        config: PropTypes.any,
        block: PropTypes.object,
        active: PropTypes.bool,
        dragSource: PropTypes.func,
        beginDrag: PropTypes.func,
        dragEnd: PropTypes.func
    }

    shouldComponentUpdate = () => {
        return false;
    }

    render() {
        const {dragSource, config, ...rest} = this.props;

        if (!config) return null;

        const DragComponent = config;
        if (isValidateReactComponent(DragComponent)) return <DragComponent {...rest}/>

        return (
            dragSource(<div styleName='drag-wrap' className='drag-wrap' />)
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        beginDrag: (payload) => dispatch(blockActions.actStart(payload)),
        dragEnd: (payload) => dispatch(blockActions.dragEnd(payload))
    }
}

export {DragSection}
export default connect(null, mapDispatchToProps)(DragSection);
