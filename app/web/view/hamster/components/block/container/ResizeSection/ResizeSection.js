import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'

import styles from './ResizeSection.scss'
import parseConfig from './configManager'
import resizeSource from '../../decorator/operation/resize';
import blockActions from '../../../../actions/block';


const spec = {
    beginResize: (props, monitor, component) => {
        const {actStart} = props;
        actStart && actStart(fromJS({
            type: 'resizing'
        }))
    },

    canResize: (props, monitor, component) => {
        return props.active;
    },

    endResize: (props, monitor, component) => {
        const {resizeEnd} = props;
        const offset = monitor.getOffset();
        const direction = monitor.getDirection()

        resizeEnd && resizeEnd(fromJS({
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
        config: PropTypes.object,
        block: PropTypes.object,
        active: PropTypes.bool,
        hamster: PropTypes.object,
        clickBlock: PropTypes.func,
        actStart: PropTypes.func,
        resizeEnd: PropTypes.func
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

const mapDispatchToProps = dispatch => {
    return {
        actStart: (payload) => dispatch(blockActions.actStart(payload)),
        resizeEnd: (payload) => dispatch(blockActions.resizeEnd(payload))
    }
}

export {ResizeSection}
export default connect(null, mapDispatchToProps)(ResizeSection);
