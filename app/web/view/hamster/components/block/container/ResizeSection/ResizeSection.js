import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'

import styles from './ResizeSection.scss'
import parseConfig from './configManager'
// import resizeSource from '../../decorator/operation/resize';
import {resizeSource} from '@~sunsimiao/cj-react-dnd'
import blockActions from '../../../../actions/block';
import PureContainerComponent from '../PureContainerComponent';
import { isValidateReactComponent } from '../../../../utils/miaow';


const spec = {
    beginResize: (props, monitor, component) => {
        const {beginResize, block} = props;

        const item = {
            type: 'resizing',
            blockId: block.get('id')
        };

        beginResize && beginResize(fromJS(item))

        return item;
    },

    canResize: (props, monitor, component) => {
        const {canResize} = props;
        
        return canResize ? canResize(props, monitor) : true;
    },

    resize: (props, monitor) => {
        const {resize, block} = props;
        const offset = monitor.getDifferenceFromInitialOffset();
        const direction = monitor.getDirection()

        resize && resize(fromJS({
            blockId: block.get('id'),
            offset,
            direction
        }));
    },

    endResize: (props, monitor, component) => {
        const {resizeEnd} = props;
        const offset = monitor.getDifferenceFromInitialOffset();
        const direction = monitor.getDirection()

        resizeEnd && resizeEnd(fromJS({
            offset,
            direction
        }));
    }
}

const collect = (connect, monitor) => ({
    resizeNorth: connect.resizeNorth(),
    resizeSouth: connect.resizeSouth(),
    resizeEast: connect.resizeEast(),
    resizeWest: connect.resizeWest(),
    resizeNW: connect.resizeNW(),
    resizeNE: connect.resizeNE(),
    resizeSE: connect.resizeSE(),
    resizeSW: connect.resizeSW(),
})

@resizeSource('container', spec, collect)
@CSSModules(styles)
class ResizeSection extends PureContainerComponent {
    static propTypes = {
        resizeNorth: PropTypes.func,
        resizeSouth: PropTypes.func,
        resizeEast: PropTypes.func,
        resizeWest: PropTypes.func,
        resizeNW: PropTypes.func,
        resizeNE: PropTypes.func,
        resizeSW: PropTypes.func,
        resizeSE: PropTypes.func,
        config: PropTypes.any,
        block: PropTypes.object,
        active: PropTypes.bool,
        beginResize: PropTypes.func,
        resizeEnd: PropTypes.func
    }

    static displayName = 'ResizeSection'

    options;

    constructor(props, context) {
        super(props, context);
        
        this.options = parseConfig(props.config);
    }
    
    render() {
        const {resizeNorth, resizeSouth, resizeEast, resizeWest, resizeNW, resizeNE,  resizeSW, resizeSE, config} = this.props;

        const MaybeComponent = config;
        if (isValidateReactComponent(MaybeComponent)) return <MaybeComponent {...this.props}/>

        return (
            <React.Fragment>
                {this.options.n && resizeNorth(<div styleName='north'/>)}
                {this.options.s && resizeSouth(<div styleName='south'/>)}
                {this.options.e && resizeEast(<div styleName='east'/>)}
                {this.options.w && resizeWest(<div styleName='west'/>)}
                {this.options.nw && resizeNW(<div styleName='NW'/>)}
                {this.options.ne && resizeNE(<div styleName='NE'/>)}
                {this.options.sw && resizeSW(<div styleName='SW'/>)}
                {this.options.se && resizeSE(<div styleName='SE'/>)}
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        beginResize: (payload) => dispatch(blockActions.actStart(payload)),
        canResize: () => ownProps.active,
        resizeEnd: (payload) => dispatch(blockActions.resizeEnd(payload))
    }
}

export {ResizeSection}
export default connect(null, mapDispatchToProps)(ResizeSection);
