// 生成source对象
class DragSource {
    constructor (spec, monitor) {
        this.spec = spec;
        this.props = {};
        this.component = null;
        this.monitor = monitor;
    }

    receiveProps (props) {
        this.props = props;
    }

    reveiveComponent (component) {
        this.component = component;
    }

    // receiveMonitor (monitor) {
    //     this.monitor = monitor;
    // }

    beginDrag (props, monitor, component) {
        this.spec.beginDrag(this.props, this.monitor, this.component)
    }

    canDrag () {
        return true;
    }

    endDrag () {
        this.spec.endDrag(this.props, this.monitor, this.component)
    }

}

export default (spec, monitor) => new DragSource(spec, monitor);
