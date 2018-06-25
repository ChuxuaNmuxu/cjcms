import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'PPT': {
        'INIT': pmCreater,
    }
})

export default actionCreaters.ppt;
