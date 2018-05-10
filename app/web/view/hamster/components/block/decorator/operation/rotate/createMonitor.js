/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
import {DragMonitor} from '../drag/createMonitor';

class RotateMonitor extends DragMonitor{
    constructor (manager) {
       super(manager)
    }

    canRotate () {
        return true;
    }
}

export default (manager) => new RotateMonitor(manager);
