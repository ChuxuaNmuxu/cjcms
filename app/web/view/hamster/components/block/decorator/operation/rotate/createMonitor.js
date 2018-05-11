/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
import Monitor from '../base/Monitor';

class RotateMonitor extends Monitor{
    constructor (manager) {
       super(manager)
    }

    canRotate () {
        return true;
    }
}

export default (manager) => new RotateMonitor(manager);
