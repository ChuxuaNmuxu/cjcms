/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
import Monitor from '../base/Monitor';

class ResizeMonitor extends Monitor {
    constructor (manager) {
       super(manager)
    }

    canResize () {
        return true;
    }

    getDirection () {
        return this.getState().dragOperation.sourceOptions.dir
    }
}


export default (manager) => new ResizeMonitor(manager);
