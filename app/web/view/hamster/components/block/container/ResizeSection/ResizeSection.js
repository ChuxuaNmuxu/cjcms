import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules'
import styles from './ResizeSection.scss'
import resizeSource from '../../decorator/operation/resize';
import {fromJS} from 'immutable'
import parseConfig from './configManager'

const spec = {
    beginResize: (props, monitor, component) => {
        console.log('resizeStart: ', monitor.getState())
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
    static propTypes = {
        resizeNorth: PropTypes.func,
        resizeSouth: PropTypes.func,
        resizeEast: PropTypes.func,
        resizeWest: PropTypes.func,
        resizeNW: PropTypes.func,
        resizeNE: PropTypes.func,
         resizeSW: PropTypes.func,
        resizeSE: PropTypes.func,
        config: PropTypes.object
    }

    static displayName = 'ResizeSection'

    render() {
        const {resizeNorth, resizeSouth, resizeEast, resizeWest, resizeNW, resizeNE,  resizeSW, resizeSE} = this.props;
        const {config = fromJS({resizable: true})} = this.props;

        const options = parseConfig(config.get( 'resizable'))

        return (
            <React.Fragment>
                {options.n && resizeNorth(<div styleName='north'/>)}
                {options.s && resizeSouth(<div styleName='south'/>)}
                {options.e && resizeEast(<div styleName='east'/>)}
                {options.w && resizeWest(<div styleName='west'/>)}
                {options.nw && resizeNW(<div styleName='NW'/>)}
                {options.ne && resizeNE(<div styleName='NE'/>)}
                {options.sw && resizeSW(<div styleName='SW'/>)}
                {options.se && resizeSE(<div styleName='SE'/>)}
            </React.Fragment>
        );
    }
}

export default ResizeSection;