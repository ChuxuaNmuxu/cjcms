import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'BLOCK': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
        'PROPS_CHANGE': pmCreater,
        'DRAG_END': pmCreater,
        'CLICK': pmCreater,
        'GROUP_UNITE': pmCreater
    }
})

export default actionCreaters.block;
