import {DragSource} from '../drag/createSource'

class RotateSource extends DragSource {
    constructor (spec, monitor) {
        super(spec, monitor)
    }

    beginAct (props, monitor, component) {
        this.spec.beginRotate(this.props, this.monitor, this.component)
    }

    canAct () {
        return true;
    }

    endAct () {
        this.spec.endRotate(this.props, this.monitor, this.component)
    }
}

export default (spec, monitor) => new RotateSource(spec, monitor);
