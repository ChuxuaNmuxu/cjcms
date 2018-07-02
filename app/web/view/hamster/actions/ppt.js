import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'PPT': {
        'INIT': pmCreater,
        'SAVE_DATA': pmCreater
    }
})

export default actionCreaters.ppt;
