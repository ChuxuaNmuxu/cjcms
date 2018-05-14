import { BEGIN_DRAG, END_DRAG } from "../actions/dragDrop";

const initialState = {
	itemType: null,
	item: null,
	sourceId: null,
	targetIds: [],
	dropResult: null,
	didDrop: false
}

export default function (state=initialState, action) {
    switch (action.type) {
        case BEGIN_DRAG:
            return {
				...state,
				sourceOptions: action.sourceOptions,
				itemType: action.itemType,
				item: action.item,
				sourceId: action.sourceId,
				dropResult: null,
				didDrop: false
            }
        case END_DRAG:
        default:
            return state;
    }
}

