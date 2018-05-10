import { BEGIN_DRAG, HOVER } from "../actions/dragDrop";
import {isEqual} from 'lodash';

const initialState = {
	initialSourceClientOffset: null,
	initialClientOffset: null,
	clientOffset: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case BEGIN_DRAG:
            const {sourceClientOffset, clientOffset} = action;
            return {
                initialSourceClientOffset: sourceClientOffset,
                initialClientOffset: clientOffset,
                clientOffset
            }
        case HOVER:
            if (isEqual(state.clientOffset, action.clientOffset)) {
                return state
            }
            return {
                ...state,
                clientOffset: action.clientOffset
            }
        default:
            return state;
    }
}