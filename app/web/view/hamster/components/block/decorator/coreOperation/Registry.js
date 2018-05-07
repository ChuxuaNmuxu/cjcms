const getNextId = (init) => {
    let id = init || 0;
    return () => {
        return id++
    }
}

const getId = getNextId(10)

export default class Registry {
    constructor (store) {
        this.props = {};
        // 保存资源对象，其成员主要是操作过程中的钩子函数
        this.sources = {};
    }

    createId () {
        return getId();
    }

    addSource (source, monitor) {
        const id = this.createId();
        console.log('id: ', id)
        this.sources[id] = source;
        // this.monitors[id] = monitor;
        return id;
    }

    getSource (sourceId) {
        return  this.sources[sourceId];
    }

    unRegistry (sourceId) {
        delete this.sources[sourceId]
    }
}