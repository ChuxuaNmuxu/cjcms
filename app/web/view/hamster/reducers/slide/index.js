import {slide} from './slide'
import {createReducer} from '../helper/helper';
import initialState from '../initialState';

const namespace = 'SLIDE';

export default createReducer(initialState.hamster, slide, namespace);