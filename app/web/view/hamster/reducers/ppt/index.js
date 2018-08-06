import {ppt} from './ppt'
import {createReducer} from '../helper/helper';
import initialState from '../initialState';

const namespace = 'PPT';
export default createReducer(initialState.hamster, ppt, namespace);