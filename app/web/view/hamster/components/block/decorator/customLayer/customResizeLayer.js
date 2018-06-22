import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import {connect} from 'react-redux'
import {omit} from 'lodash'
import hoistNonReactStatics  from 'hoist-non-react-statics'

import { handleResize } from '../../../../reducers/helper/helper';
import resizeLayler from '../../decorator/operation/resize/ResizeLayer';

const collect = (monitor, props) => ({
    offset: monitor.getOffset(),
    direction: monitor.getDirection(),
    isResizing: monitor.isResizing()
})

export const customResizeLayer = () => DecoratedComponent => {
    @resizeLayler(collect)
    class CustomDisplayLayler extends Component {
        static propTypes = {
            offset: PropTypes.object,
            item: PropTypes.object,
            hamster: PropTypes.object,
            isResizing: PropTypes.bool,
        }
    
        shouldComponentUpdate (nextProps) {
            // 引入hamster的优化
            if (
                (this.props.isResizing
                && (nextProps.offset && nextProps.offset.x !== 0 && nextProps.offset.y !== 0))
                || !this.props.entities.equals(nextProps.entities)
            ) return true;
            return false;
        }

        render() {
            console.log('resize')
            const {offset, isResizing, hamster, direction} = this.props;
            const props = omit(this.props, 'offset', 'isResizing');
            let {entities} = props;
            
            if (isResizing && hamster) {
                const hamsterState = handleResize(hamster, fromJS({
                    direction,
                    offset
                }))
    
                entities = hamsterState.get('entities');   
            }

            return (
                <DecoratedComponent 
                  {...props}
                  entities={entities}
                />
            )
        }
    }

    return hoistNonReactStatics(CustomDisplayLayler, DecoratedComponent);
}

const mapStateToProps = (state) => {
    const {hamster} = state;
    return {
        hamster
    }
}

export default (options) => WrapComponent => connect(mapStateToProps)(customResizeLayer(options)(WrapComponent));
