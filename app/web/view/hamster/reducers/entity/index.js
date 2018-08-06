import {entity} from './entity'
import {createReducer} from '../helper/helper';
import initialState from '../initialState';

const namespace = 'ENTITY';
export default createReducer(initialState.hamster, entity, namespace);
