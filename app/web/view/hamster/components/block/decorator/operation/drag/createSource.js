/**
 * 为dragSource的回调传递相关参数，便于reduce中使用
 * @input spec, monitor
 * @input props
 * @input component
 */
import SourceHandles from '../base/SourceHandles';

class DragSource extends SourceHandles {
    constructor (spec, monitor) {
       super(spec, monitor)
    }

    beginAct () {
        const item = {
            actType: 'drag'
        }
        const customItem = this.spec.beginDrag ? this.spec.beginDrag(this.props, this.monitor, this.component) : {};

        return {
            ...item,
            ...customItem
        }
    }

    acting () {
        this.spec.drag && this.spec.drag(this.props, this.monitor, this.component);
    }

    canAct () {
        return this.spec.canDrag ? this.spec.canDrag(this.props, this.monitor, this.component) : true;
    }

    endAct () {
        this.spec.endDrag && this.spec.endDrag(this.props, this.monitor, this.component)
    }
}

export default (spec, monitor) => new DragSource(spec, monitor);
