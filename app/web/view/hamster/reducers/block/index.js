import {block} from './block';
import {createReducer} from '../helper/helper';
import initialState from '../initialState';

const namespace = 'BLOCK';
export default createReducer(initialState.hamster, block, namespace);
