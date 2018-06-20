import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {displayLayer} from '../decorator/operation/base/displayLayer'
import * as currentHelper from '../../../reducers/helper/current'
import CustomDragLayer from './CustomDragLayer';

const collect = (monitor, props) => {
    return {
        isActing: monitor.isActing(),
        initialOffset: monitor.getInitialClientOffset(),
        offset: monitor.getOffset()
    }
}

const mapStateToProps = (state) => {
    const {hamster} = state;
    return {
        hamster,
        isDragging: currentHelper.isDragging(hamster),
        isResizing: currentHelper.isResizing(hamster),
        isRotating: currentHelper.isRotating(hamster)
    }
}

@connect(mapStateToProps)   
@displayLayer(collect)
class CustomLayer extends Component {
    static propTypes = {
        hamster: PropTypes.object
    }

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            hamster: {}
        }
    }
    

    shouldComponentUpdate (nextProps) {
        // TODO: 为引入hamster而做的优化
        return this.props.isActing !== nextProps.isActing
    }

    componentWillReceiveProps (nextProps) {
        if (!this.props.isActing && nextProps.isActing) {
            this.setState({
                hamster: nextProps.hamster
            })
        }
    }

    render() {
        const {hamster} = this.state;
        const {isDragging, isResizing, isRotating, offset} = this.props;

        return (
            <div>
                {isDragging && <CustomDragLayer hamster={hamster} />}
                {/* {isResizing && <CustomDragLayer hamster={hamster} />} */}
                {/* {isRotating && <CustomDragLayer hamster={hamster} />} */}
            </div>
        )
    }
}

export default CustomLayer;
