import dragOffset from "./dragOffset";
import dragOperation from "./dragOperation";
import stateId from "./stateId";

export default function reduce (state = {}, action) {
    return {
        dragOffset: dragOffset(state.dragOffset, action),
        dragOperation: dragOperation(state.dragOperation, action),
        stateId: stateId(state.stateId)
    }
}
