import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import styles from './DragSection.scss';
// import {DragSource} from '../decorator/operation/drag';
import {DragSource} from '@ssm1982/cj-react-dnd'
import {fromJS} from 'immutable'
import {connect} from 'react-redux'
import {omit} from 'lodash'
import {getEmptyImage} from '@ssm1982/cj-react-dnd'

import blockActions from '../../../actions/block';
import { isValidateReactComponent } from '../../../utils/miaow';
import PureContainerComponent from './PureContainerComponent';
import {withHamster} from '../../../manager'

let beforeDrag = true;

const spec = {
    beginDrag (props, monitor) {
        const {beginDrag, block} = props;

        const item = {
            type: 'dragging',
            blockId: block.get('id')
        };
        
        beginDrag && beginDrag(fromJS(item))

        beforeDrag = true;

        return item;
    },

    drag (props, monitor) {
        const {drag, block, hamster} = props;

        if (beforeDrag) {
            hamster.fire('beforeDrag', monitor.getEvent());
            beforeDrag = false;
        }

        console.log(35, monitor.getEvent())

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

        console.log(64, monitor.getEvent())

        dragEnd && dragEnd(fromJS({
            offset,
            blockId: block.get('id')
        }));
    }
}

const collect = (connect, monitor) => {
    return {
        monitor,
        dragSource: connect.dragSource(),
        dragPreview: connect.dragPreview(),
    }
}

@withHamster()
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

    componentDidMount () {
        const {dragPreview} = this.props;
        dragPreview && dragPreview(getEmptyImage())
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
