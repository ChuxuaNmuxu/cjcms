import { createActions } from 'redux-actions';

const payloadCreator = payload => payload;
const metaCreater = (payload, meta) => meta;
const pmCreater = [payloadCreator, metaCreater]

const actionCreaters = createActions({
    'BLOCK': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
        'PROPS_CHANGE': pmCreater,
        'ENTITIES_CHANGE': pmCreater,
        'CLICK': pmCreater,
        'UNITE': pmCreater
    }
})

export default actionCreaters.block;
