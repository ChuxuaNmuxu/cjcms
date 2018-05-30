/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
class ResizeMonitor {
    canResize () {
        return true;
    }

    getDirection () {
        return this.getState().dragOperation.sourceOptions.dir
    }
}


export default ResizeMonitor
