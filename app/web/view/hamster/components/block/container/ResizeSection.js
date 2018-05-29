import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules'
import styles from './ResizeSection.scss'
import resizeSource from '../decorator/operation/resize';
import {fromJS} from 'immutable'

const spec = {
    beginResize: (props, monitor, component) => {
        console.log('resizeStart: ', monitor.innerMonitor.store.getState())
    },

    canResize: (props, monitor, component) => {
        const {block} = props;
        const blockId = block.get('id');
        const activatedId = props.hamster.getActivatedBlockIds();
        
        return activatedId.includes(blockId);
    },

    endResize: (props, monitor, component) => {
        const offset = monitor.getOffset();
        const direction = monitor.getDirection()

        props.hamster.blockManager.resizeEnd(fromJS({
            offset,
            direction
        }));
    }
}

const collect = (monitor, connect) => ({
    resizeNorth: connect.resizeNorth(),
    resizeSouth: connect.resizeSouth(),
    resizeEast: connect.resizeEast(),
    resizeWest: connect.resizeWest(),
    resizeNW: connect.resizeNW(),
    resizeNE: connect.resizeNE(),
    resizeSE: connect.resizeSE(),
    resizeSW: connect.resizeSW(),

    offset: monitor.getOffset()
})

@resizeSource('container', spec, collect)
@CSSModules(styles)
class ResizeSection extends Component {

    static displayName = 'ResizeSection'

    render() {
        const {resizeNorth, resizeSouth, resizeEast, resizeWest, resizeNW, resizeNE,  resizeSW, resizeSE} = this.props;
        return (
            <React.Fragment>
                {resizeNorth(<div styleName='north'/>)}
                {resizeSouth(<div styleName='south'/>)}
                {resizeEast(<div styleName='east'/>)}
                {resizeWest(<div styleName='west'/>)}
                {resizeNW(<div styleName='NW'/>)}
                {resizeNE(<div styleName='NE'/>)}
                {resizeSW(<div styleName='SW'/>)}
                {resizeSE(<div styleName='SE'/>)}
            </React.Fragment>
        );
    }
}

ResizeSection.propTypes = {

};

export default ResizeSection;