import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import styles from './DragSection.scss';
// import {DragSource} from '../decorator/operation/drag';
import {DragSource} from 'my-ts-app'
import {fromJS} from 'immutable'
import {connect} from 'react-redux'
import {omit} from 'lodash'

import blockActions from '../../../actions/block';
import { isValidateReactComponent } from '../../../utils/miaow';
import PureContainerComponent from './PureContainerComponent';

const spec = {
    beginDrag (props, component) {
        const {beginDrag, block} = props;

        const item = {
            type: 'dragging',
            blockId: block.get('id')
        };
        
        beginDrag && beginDrag(fromJS(item))
        return item;
    },

    drag (props, monitor) {
        const {drag, block} = props;
        const offset = monitor.getDifferenceFromInitialOffset();
        drag && drag(fromJS({
            offset,
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
        const offset = monitor.getDifferenceFromInitialOffset();

        dragEnd && dragEnd(fromJS({
            offset,
            blockId: block.get('id')
        }));
    }
}

const collect = (connect, monitor) => {
    return {
        monitor,
        dragSource: connect.dragSource()
    }
}

@DragSource('block', spec, collect)
@CSSModules(styles)
class DragSection extends PureContainerComponent {
    static displayName = 'DragSection'

    static propTypes = {
        config: PropTypes.any,
        block: PropTypes.object,
        active: PropTypes.bool,
        dragSource: PropTypes.func,
        beginDrag: PropTypes.func,
        dragEnd: PropTypes.func
    }

    render() {
        const {dragSource, config, children} = this.props;


        if (!config) return null;

        const MaybeDragComponent = config;
        if (isValidateReactComponent(MaybeDragComponent)) return <MaybeDragComponent {...this.props}/>


        return (
            dragSource(<div styleName='drag-wrap' className='drag-wrap' >{children}</div>)
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
