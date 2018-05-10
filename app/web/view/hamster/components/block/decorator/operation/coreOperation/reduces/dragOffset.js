import { BEGIN_DRAG } from "../actions/dragDrop";

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
                clientOffset,
            }
        default:
            return state;
    }
}