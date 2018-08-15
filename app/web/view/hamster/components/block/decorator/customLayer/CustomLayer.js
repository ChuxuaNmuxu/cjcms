
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {reduce, omit} from 'lodash'
import {connect} from 'react-redux'
import { Layer } from '@~sunsimiao/cj-react-dnd';
import hoistNonReactStatics  from 'hoist-non-react-statics'
import { handleDrag, handleResize, handleRotate } from '../../../../reducers/helper/helper';
import {fromJS} from 'immutable'
import { getRotateAngle } from '../../../../utils/block';

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
            initialClientOffset: PropTypes.object,
            clientOffset: PropTypes.object,
            offset: PropTypes.object,
            item: PropTypes.object,
            isDragging: PropTypes.bool,
            isResizing: PropTypes.bool,
            isRotating: PropTypes.bool,
            direction: PropTypes.string,
            hamster: PropTypes.object,
            dispatch: PropTypes.func,
            blockIds: PropTypes.object,
            currentBlocks: PropTypes.object
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

            let hamsterState = hamster
            if (isDragging) {
                const {blockId} = item;
            
                hamsterState = handleDrag(hamster, fromJS({
                    blockId,
                    offset
                }))
            }

            if (isResizing) {
                hamsterState = handleResize(hamster, fromJS({
                    direction,
                    offset
                }))
            }

            if (isRotating) {
                const {blockId, initBlock} = item;
                
                const rotateAngle = getRotateAngle(initBlock, initialClientOffset, clientOffset);
                hamsterState = handleRotate(hamster, fromJS({
                    blockId,
                    rotateAngle
                }))
        
            }
            
            const entities = hamsterState.get('entities');
            const snapCoord = hamsterState.getIn(['current', 'snap', 'data']);

            const props = omit.apply(null, [this.props].concat(collectOptions))

            return (
                <DecoratedComponent
                  {...props}
                  entities={entities}
                  snapCoord={snapCoord}
                />
            )
        }
    }

    return hoistNonReactStatics(CustomLayer, DecoratedComponent);
}

export default customLayer;
