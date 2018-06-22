import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics  from 'hoist-non-react-statics'

import dragLayer from '../decorator/operation/DragLayer';
import { handleDrag, handleRotate, handleResize } from '../../../reducers/helper/helper';
import { withHamster } from '../../../manager';
import { fromJS } from 'immutable';
import { getRotateAngle } from '../../../utils/block';
import { getEntity } from '../../../reducers/helper/entity';

const collect = (monitor, props) => ({
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    offset: monitor.getOffset(),
    resizeDirction: monitor.getState().dragOperation.sourceOptions.dir,
    isActing: monitor.isActing()
})


const customDisplayLayler = () => DecoratedComponent => {
    @dragLayer(collect)
    @withHamster()
    class CustomDisplayLayler extends Component {
        static propTypes = {
            prop: PropTypes
        }
    
        render() {
            const {
                initialClientOffset,
                resizeDirction,
                clientOffset,
                offset,
                isActing,
                hamster,
                ...rest
            } = this.props;
            
            const blockId = hamster.blockManager.getOperatingBlockId();
            if (!isActing || !rest.entities || !blockId) return <DecoratedComponent {...rest} />

            let hamsterState = hamster.getState('hamster');

            const isDragging = hamster.blockManager.isDragging();
            if (isDragging) {
                hamsterState = handleDrag(hamsterState, fromJS({
                    blockId,
                    offset
                }))
            }

            const isRotating = hamster.blockManager.isRotating();
            if (isRotating) {
                if (!this.block) {
                    this.block = getEntity(hamsterState)(blockId);
                }
                const rotateAngle = getRotateAngle(this.block, initialClientOffset, clientOffset);
                hamsterState = handleRotate(hamsterState, fromJS({
                    blockId,
                    rotateAngle
                }))
            }
            this.block = null;

            const isResizing = hamster.blockManager.isResizing();
            if (isResizing) {
                hamsterState = handleResize(hamsterState, fromJS({
                    direction: resizeDirction,
                    offset
                }))
            }

            const entities = hamsterState.get('entities');

            return (
                <DecoratedComponent 
                  {...rest}
                  entities={entities}
                />
            )
        }
    }

    return hoistNonReactStatics(customDisplayLayler, DecoratedComponent);
}

export default customDisplayLayler
