/**
 * 为dragSource的回调传递相关参数，便于reduce中使用
 * @input spec, monitor
 * @input props
 * @input component
 */
export class DragSource {
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

    beginAct (props, monitor, component) {
        this.spec.beginDrag(this.props, this.monitor, this.component)
    }

    canAct () {
        return true;
    }

    endAct () {
        this.spec.endDrag(this.props, this.monitor, this.component)
    }

}

export default (spec, monitor) => new DragSource(spec, monitor);
