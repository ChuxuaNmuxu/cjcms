import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'SLIDE': {
        'ADD': pmCreater,
        'ACTIVATE': pmCreater,
        'ADD_GROUP': pmCreater,
    }
})

export default actionCreaters.slide;
