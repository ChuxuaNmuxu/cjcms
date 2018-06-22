import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';
import {fromJS} from 'immutable'

import {DragSource} from '../../../../../components/block/decorator/operation/drag'
import styles from './ContainerSection.scss';

const spec = {
    beginDrag (props, monitor, component) {
        console.log('beginDrag.group: ', props)
    },

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

@DragSource('group', spec, collect)
@CSSModules(styles)
export default class ContainerSection extends Component {
    static propTypes = {
        config: PropTypes.object,
        dragSource: PropTypes.func
    }

    render() {
        const {dragSource} = this.props;

        return (
            <div styleName='group-container-wrap' className='group-container-wrap'>
                {
                    dragSource(<div className="top" />)
                }
                              {
                    dragSource(<div className="right" />)
                }
                              {
                    dragSource(<div className="bottom" />)
                }
                {
                    dragSource(<div className="left" />)
                }
            </div>
        )
    }
}
