import { createActions } from 'redux-actions';

import {pmCreater} from './helper'

const actionCreaters = createActions({
    'NAV': {
        'MOUSEDOWN': pmCreater,
    }
})

export default actionCreaters.nav;
