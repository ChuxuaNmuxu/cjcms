export default class Monitor {
    getSourceId () {
        return this.store.getState().dragOperation.sourceId;
    }
}