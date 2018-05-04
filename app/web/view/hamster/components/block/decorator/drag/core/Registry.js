const getNextId = (init) => {
    let id = init || 0;
    return () => {
        return id++
    }
}

const getId = getNextId(10)

export default class Registry {
    constructor () {
        this.props = {};
        this.handles = [];
    }

    createId () {
        // 每个注册的node的ID
        return getId();
    }

    addSource (source) {
        const id = this.createId();
        console.log('id: ', id)
        this.handles[id] = source;
        return id;
    }

    getSource (sourceId) {
        return  this.handles[sourceId];
    }

    unRegistry (sourceId) {
        delete this.handlers[sourceId]
    }
}