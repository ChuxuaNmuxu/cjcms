import { createActions } from 'redux-actions';

const payloadCreator = payload => payload;
const metaCreater = (payload, meta) => meta;
const pmCreater = [payloadCreator, metaCreater]

const actionCreaters = createActions({
    'BLOCK': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
        'PROPS_CHANGE': pmCreater,
        'DRAG_END': pmCreater,
        'CLICK': pmCreater,
        'GROUP_UNITE': pmCreater,
        'ROTATE_END': pmCreater 
    }
})

export default actionCreaters.block;
