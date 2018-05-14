import {getDifferenceFromInitialOffset} from './utils'

export default class Monitor {
    constructor (manager) {
        this.sourceId = null;
        this.registry = manager.getRegistry();
        this.innerMonitor = manager.getMonitor();
    }

    getInnerMonitor () {
        return this.innerMonitor;
    }

    getState () {
        return this.innerMonitor.getState();
    }

    reveiveSourceId (sourceId) {
        // 注册当前资源ID，获取registry中注册的source或者结合全局redux用以判断当前资源的的状态等
        this.sourceId = sourceId
    }

    getOffset () {
        return getDifferenceFromInitialOffset(this.getState().dragOffset)
    }
}