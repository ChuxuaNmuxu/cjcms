import { fromJS } from 'immutable';
import {connect} from 'react-redux';

import { handleRotate } from '../../../../reducers/helper/helper';
import rotateLayler from '../../decorator/operation/rotate/RotateLayer';
import { getRotateAngle } from '../../../../utils/block';
import { omit } from '../../../../Utils/miaow';
import customDragLayerFactory from './CustomLayer';

const omitProps = omit('initialClientOffset', 'item', 'clientOffset', 'isRotating', 'offset');

export const customRotateLayer = customDragLayerFactory({
    layerType: rotateLayler,
    actType: 'isRotating',
    omitProps,
    getEntities: props => {
        const {initialClientOffset, clientOffset, item, hamster} = props;
        const {blockId, initBlock} = item;
        
        const rotateAngle = getRotateAngle(initBlock, initialClientOffset, clientOffset);
        const hamsterState = handleRotate(hamster, fromJS({
            blockId,
            rotateAngle
        }))

        return hamsterState.get('entities');
    },
})

const mapStateToProps = (state) => {
    const {hamster} = state;
    return {
        hamster
    }
}

export default (options) => WrapComponent => connect(mapStateToProps)(customRotateLayer(options)(WrapComponent));
