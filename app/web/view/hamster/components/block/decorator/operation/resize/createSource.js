import {DragSource} from '../drag/createSource'

class resizeSource extends DragSource {
    constructor (spec, monitor) {
        super(spec, monitor)
    }

    beginAct (props, monitor, component) {
        this.spec.beginResize(this.props, this.monitor, this.component)
    }

    canAct () {
        return true;
    }

    endAct () {
        this.spec.endResize(this.props, this.monitor, this.component)
    }
}

export default (spec, monitor) => new resizeSource(spec, monitor);
