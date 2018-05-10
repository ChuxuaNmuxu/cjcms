/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 * @input manager
 * @input sourceId
 */
class DragMonitor {
    constructor (manager) {
        this.sourceId = null;
        this.registry = manager.getRegistry();
        this.innerMonitor = manager.getMonitor();
    }

    getInnerMonitor () {
        return this.innerMonitor;
    }

    reveiveSourceId (sourceId) {
        // 注册当前资源ID，获取registry中注册的source或者结合全局redux用以判断当前资源的的状态等
        this.sourceId = sourceId
    }

    canDragging () {
        return true;
    }
}

export default (manager) => new DragMonitor(manager);
