class StoreManager {
    store;
    dispatch;

    constructor (store) {
        this.store = store;
        this.dispatch = this.store.dispatch;
    }

    getStore () {
        return this.store;
    }

    getState (name = null) {
        const state = this.store.getState();
        return name ? state[name] : state;
    }
}

export default StoreManager;
