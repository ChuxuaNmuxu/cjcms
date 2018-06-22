import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import {connect} from 'react-redux';
import hoistNonReactStatics  from 'hoist-non-react-statics'

import { handleRotate } from '../../../../reducers/helper/helper';
import rotateLayler from '../../decorator/operation/rotate/RotateLayer';
import { getRotateAngle } from '../../../../utils/block';
import { omit, shallowEqual } from '../../../../Utils/miaow';

const omitProps = omit('initialClientOffset', 'item', 'clientOffset', 'isRotating');

const collect = (monitor, props) => ({
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    offset: monitor.getOffset(),
    item: monitor.getItem(),
    isRotating: monitor.isRotating()
})

export const customRotateLayer = () => DecoratedComponent => {
    @rotateLayler(collect)
    class CustomDisplayLayler extends Component {
        static propTypes = {
            offset: PropTypes.object,
            initialClientOffset: PropTypes.object,
            clientOffset: PropTypes.object,
            item: PropTypes.object,
            hamster: PropTypes.object,
            isRotating: PropTypes.bool,
        }

        shouldComponentUpdate (nextProps) {
            // 引入hamster的优化
            const prevProps = omitProps(this.props);
            const props = omitProps(nextProps);
            if (
               ( this.props.isRotating
                && (nextProps.offset && nextProps.offset.x !== 0 && nextProps.offset.y !== 0))
                || !shallowEqual(prevProps, props)
            ) return true;
            return false;
        }

        render() {
            console.log('rotate')
            const {initialClientOffset, clientOffset, item, isRotating, hamster} = this.props;
            const props = omitProps(this.props);
            let {entities} = props;

            if (isRotating && hamster) {
                const {blockId, initBlock} = item;
                
                const rotateAngle = getRotateAngle(initBlock, initialClientOffset, clientOffset);
                const hamsterState = handleRotate(hamster, fromJS({
                    blockId,
                    rotateAngle
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

export default (options) => WrapComponent => connect(mapStateToProps)(customRotateLayer(options)(WrapComponent));
