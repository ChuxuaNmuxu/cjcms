import { createActions } from 'redux-actions';

const payloadCreator = payload => payload;
const metaCreater = (payload, meta) => meta;
const pmCreater = [payloadCreator, metaCreater]

const actionCreaters = createActions({
    'BLOCK': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
        'PROPS_CHANGE': pmCreater,
        'CLICK': pmCreater,
        'GROUP_UNITE': pmCreater,
        'ACT_START': pmCreater,
        'DRAG_END': pmCreater,
        'ROTATE_END': pmCreater ,
        'RESIZE_END': pmCreater,
        'BLOCK_DELETE': pmCreater,
    }
})

export default actionCreaters.block;
