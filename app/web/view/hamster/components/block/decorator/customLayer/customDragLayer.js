import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import hoistNonReactStatics  from 'hoist-non-react-statics'

import dragLayer from '../../decorator/operation/drag/DragLayer';
import { handleDrag} from '../../../../reducers/helper/helper';
import { omit, shallowEqual } from '../../../../Utils/miaow';

const omitProps = omit('offset', 'item', 'isDragging', 'hamster');

const collect = (monitor, props) => ({
    item: monitor.getItem(),
    offset: monitor.getOffset(),
    isDragging: monitor.isDragging()
})

export const customDragLayer = () => DecoratedComponent => {
    @dragLayer(collect)
    class CustomDisplayLayler extends Component {
        static propTypes = {
            offset: PropTypes.object,
            item: PropTypes.object,
            hamster: PropTypes.object,
            isDragging: PropTypes.bool
        }
    
        shouldComponentUpdate (nextProps) {
            // 引入hamster的优化
            /**
             * 1. 正在drag, 使用this.props.isDragging而不是nextProps.isDragging是为了多渲染一步，因为在dnd的dragEnd钩子在action中执行，晚于dnd内部的dragEnd的reduce执行，
             *    在外部dragEnd的钩子执行完，hamster已经更新后，monitor.isDragging还没有更新为false，hamster会再次被更新为两倍距离，多执行一步可以用外部dragEnd计算的
             *    hamster覆盖计算错误的hamster
             * 2. 有位移
             * 3. entities因为其他原因有改变，需要render将entities传递下去
             * 
            */
            const prevProps = omitProps(this.props);
            const props = omitProps(nextProps);
            if (
                (this.props.isDragging
                && (nextProps.offset && nextProps.offset.x !== 0 && nextProps.offset.y !== 0))
                || !shallowEqual(prevProps, props)
            ) return true;
            return false;
        }

        render() {
            const {offset, item, isDragging, hamster} = this.props;
            const props = omitProps(this.props);
            let {entities} = props;

            if (isDragging && hamster) {
                const {blockId} = item;
    
                const hamsterState = handleDrag(hamster, fromJS({
                    blockId,
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

export default (options) => WrapComponent => connect(mapStateToProps)(customDragLayer(options)(WrapComponent));
