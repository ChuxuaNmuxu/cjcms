import SourceHandles from '../base/SourceHandles';

class ResizeSource extends SourceHandles {
    constructor (spec, monitor) {
        super(spec, monitor)
    }

    beginAct (props, monitor, component) {
        this.spec.beginResize(this.props, this.monitor, this.component)
    }

    acting () {
        this.spec.resize && this.spec.resize(this.props, this.monitor, this.component);
    }

    canAct () {
        return true;
    }

    endAct () {
        this.spec.endResize(this.props, this.monitor, this.component)
    }
}

export default (spec, monitor) => new ResizeSource(spec, monitor);
