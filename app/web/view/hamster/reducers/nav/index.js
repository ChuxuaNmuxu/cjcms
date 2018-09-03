import {nav} from './nav'
import {createReducer} from '../helper/helper';
import initialState from '../initialState';

const namespace = 'NAV';

export default createReducer(initialState.hamster, nav, namespace);