/**
 * 每生成一个dragSource,都会实例化一个此monitor，并暴露给外部组件
 */
class RotateMonitor {
    canRotate () {
        return true;
    }

    isRotating () {
        return this.isActing() && this.getItem().actType === 'rotate'
    }
}


export default RotateMonitor
