import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import {connect} from 'react-redux'
import hoistNonReactStatics  from 'hoist-non-react-statics'

import { handleResize } from '../../../../reducers/helper/helper';
import resizeLayler from '../../decorator/operation/resize/ResizeLayer';
import { omit, shallowEqual } from '../../../../Utils/miaow';

const omitProps = omit('offset', 'isResizing')

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
            const prevProps = omitProps(this.props);
            const props = omitProps(nextProps);
            if (
                (this.props.isResizing
                && (nextProps.offset && nextProps.offset.x !== 0 && nextProps.offset.y !== 0))
                || !shallowEqual(prevProps, props)
            ) return true;
            return false;
        }

        render() {
            const {offset, isResizing, hamster, direction} = this.props;
            const props = omitProps(this.props);
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
