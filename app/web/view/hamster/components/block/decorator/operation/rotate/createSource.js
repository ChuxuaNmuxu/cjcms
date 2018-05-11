import SourceHandles from '../base/SourceHandles';

class RotateSource extends SourceHandles {
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
