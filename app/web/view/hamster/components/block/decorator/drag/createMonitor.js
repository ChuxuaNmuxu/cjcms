class DragMonitor {
    constructor (manager) {
        this.sourceId = null;
        this.registry = manager.getRegistry();
        this.state = manager.getMonitor().getState();
    }

    reveiveSourceId (sourceId) {
        this.sourceId = sourceId
    }

    canDragging () {
        return true;
    }
}

export default (manager) => new DragMonitor(manager);
