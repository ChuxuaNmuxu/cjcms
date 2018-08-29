import { fromJS } from 'immutable';
import {connect} from 'react-redux'

import { handleResize } from '../../../../reducers/helper/helper';
// import resizeLayler from '../../decorator/operation/resize/ResizeLayer';
import {ResizeLayer} from '@ssm1982/cj-react-dnd';
import { omit } from '../../../../utils/miaow';
import customDragLayerFactory from './CustomLayer';

const omitProps = omit('offset', 'isResizing');

const collect = (monitor) => ({
    offset: monitor.getDifferenceFromInitialOffset(),
    direction: monitor.getDirection(),
    isResizing: monitor.isResizing()
})

export const customResizeLayer = customDragLayerFactory({
    layerType: ResizeLayer,
    actType: 'isResizing',
    omitProps,
    collect,
    getEntities: props => {
        const {offset, hamster, direction} = props;
        console.log('direction: ', direction)
        const hamsterState = handleResize(hamster, fromJS({
            direction,
            offset
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

export default (options) => WrapComponent => connect(mapStateToProps)(customResizeLayer(options)(WrapComponent));
