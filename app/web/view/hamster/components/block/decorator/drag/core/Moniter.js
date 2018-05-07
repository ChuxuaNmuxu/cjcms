import {Monitor} from '../../coreOperation';

export default class DragDropMonitor extends Monitor {
    constructor (store) {
        super(store);
    }

    isDragging () {}

    canDragSource () {
        return true
    }

    getSourceId () {
        return this.store.getState().dragOperation.sourceId;
    }
}
