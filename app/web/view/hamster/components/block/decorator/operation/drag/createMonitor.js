/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 * @input manager
 * @input sourceId
 */
import Monitor from '../base/Monitor';

class DragMonitor extends Monitor {
    constructor (manager) {
       super(manager)
    }

    canDragging () {
        return true;
    }

    isDragging () {
        return this.isActing()
    }
}

export default (manager) => new DragMonitor(manager);
