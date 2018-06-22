/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
// import Monitor from '../base/Monitor';
// import DragManager from './DragManager';

class DragMonitor {
    canDrag () {
        return true;
    }

    isDragging () {
        return this.isActing() && this.getItem().actType === 'drag'
    }
}

export default DragMonitor;

