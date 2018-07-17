
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {reduce, omit} from 'lodash'
import {connect} from 'react-redux'
import { Layer } from 'my-ts-app';
import hoistNonReactStatics  from 'hoist-non-react-statics'
import { handleDrag } from '../../../../reducers/helper/helper';
import {fromJS} from 'immutable'

const collectOptions = ['initialClientOffset', 'clientOffset', 'offset', 'item',
'isDragging', 'isResizing', 'isRotating', 'direction', 'hamster', 'dispatch']

const collect = (monitor, props) => ({
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    offset: monitor.getDifferenceFromInitialOffset(),
    item: monitor.getItem(),

    isDragging: monitor.isDragging(),
    isResizing: monitor.isResizing(),
    isRotating: monitor.isRotating(),

    direction: monitor.getDirection()
})

const mapStateToProps = (state) => {
    const {hamster} = state;
    return {
        hamster
    }
}

const customLayer = (options) => DecoratedComponent => {
    @Layer(collect)
    @connect(mapStateToProps)
    class CustomLayer extends Component {
        static propTypes = {
            prop: PropTypes
        }
    
        render() {
            const {
                initialClientOffset,
                clientOffset,
                offset,
                item,
                isDragging,
                isResizing,
                isRotating,
                direction,
                hamster
            } = this.props;

            let entities = hamster.get('entities');

            if (isDragging) {
                const {blockId} = item;
            
                const hamsterState = handleDrag(hamster, fromJS({
                    blockId,
                    offset
                }))
                
                entities = hamsterState.get('entities');
            }

            if (isResizing) {
                const hamsterState = handleResize(hamster, fromJS({
                    direction,
                    offset
                }))
        
                entities = hamsterState.get('entities');
            }

            if (isRotating) {
                const {blockId, initBlock} = item;
                
                const rotateAngle = getRotateAngle(initBlock, initialClientOffset, clientOffset);
                const hamsterState = handleRotate(hamster, fromJS({
                    blockId,
                    rotateAngle
                }))
        
                entities = hamsterState.get('entities');
            }

            const props = omit.apply(null, [this.props].concat(collectOptions))

            console.log(props)

            return (
                <DecoratedComponent {...props} entities={entities} />
            )
        }
    }

    return hoistNonReactStatics(CustomLayer, DecoratedComponent);
}

export default customLayer;
