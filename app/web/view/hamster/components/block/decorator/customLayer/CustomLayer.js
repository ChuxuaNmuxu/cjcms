import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics  from 'hoist-non-react-statics'

import { shallowEqual } from '../../../../Utils/miaow';

const customDragLayerFactory = ({
    layerType,
    actType,
    omitProps,
    getEntities,
    collect
}) => {
    const collection = collect || ((monitor, props) => ({
        initialClientOffset: monitor.getInitialClientOffset(),
        clientOffset: monitor.getClientOffset(),
        offset: monitor.getOffset(),
        item: monitor.getItem(),
        [actType]: monitor[actType]()
    }))

    return () => DecoratedComponent => {
        @layerType(collection)
        class CustomDisplayLayler extends Component {
            static propTypes = {
                initialClientOffset: PropTypes.object,
                clientOffset: PropTypes.object,
                offset: PropTypes.object,
                item: PropTypes.object,
                hamster: PropTypes.object,
                [actType]: PropTypes.bool
            }
        
            shouldComponentUpdate (nextProps) {
                // 引入hamster的优化
                /**
                 * 1. 正在drag且有位移, 使用this.props.isDragging而不是nextProps.isDragging是为了多渲染一步，因为在dnd的dragEnd钩子在action中执行，晚于dnd内部的dragEnd的reduce执行，
                 *    在外部dragEnd的钩子执行完，hamster已经更新后，monitor.isDragging还没有更新为false，hamster会再次被更新为两倍距离，多执行一步可以用外部dragEnd计算的
                 *    hamster覆盖计算错误的hamster
                 * 2. entities因为其他原因有改变，需要render将entities传递下去
                 * 
                */
                const prevProps = omitProps(this.props);
                const props = omitProps(nextProps);
                if (
                    (this.props[actType]
                    && (nextProps.offset && nextProps.offset.x !== 0 && nextProps.offset.y !== 0))
                    || !shallowEqual(prevProps, props)
                ) return true;
                return false;
            }
    
            render() {
                let {entities} = this.props;
                
                if (this.props[actType] && this.props.hamster) {
                    entities = getEntities(this.props);
                }
                
                const props = omitProps(this.props);
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
}

export default customDragLayerFactory;
