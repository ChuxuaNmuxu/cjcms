import { fromJS } from 'immutable';
import {connect} from 'react-redux'

import { handleResize } from '../../../../reducers/helper/helper';
import resizeLayler from '../../decorator/operation/resize/ResizeLayer';
import { omit } from '../../../../Utils/miaow';
import customDragLayerFactory from './CustomLayer';

const omitProps = omit('offset', 'isResizing');

const collect = (monitor) => ({
    offset: monitor.getOffset(),
    direction: monitor.getDirection(),
    isResizing: monitor.isResizing()
})

export const customResizeLayer = customDragLayerFactory({
    layerType: resizeLayler,
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
