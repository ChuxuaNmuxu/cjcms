import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'ENTITY': {
        'PROPS_CHANGE': pmCreater,
    }
})

export default actionCreaters.entity;
