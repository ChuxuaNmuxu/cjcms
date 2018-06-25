import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'BLOCK': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
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
