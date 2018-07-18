import { fromJS } from 'immutable';

// import dragLayer from '../../decorator/operation/drag/DragLayer';
import {DragLayer} from '@~sunsimiao/cj-react-dnd';
import { handleDrag} from '../../../../reducers/helper/helper';
import { omit } from '../../../../utils/miaow';
import customLayerFactory from './CustomLayer';

const omitProps = omit('offset', 'item', 'isDragging', 'hamster');

const collect = (monitor, props) => ({
    item: monitor.getItem(),
    offset: monitor.getDifferenceFromInitialOffset(),
    isDragging: monitor.isDragging()
})

export const customDragLayer = customLayerFactory({
    layerType: DragLayer,
    actType: 'isDragging',
    omitProps,
    getEntities: props => {
        const {offset, item, hamster} = props;
        const {blockId} = item;
    
        const hamsterState = handleDrag(hamster, fromJS({
            blockId,
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

export default (options) => WrapComponent => connect(mapStateToProps)(customDragLayer(options)(WrapComponent));
