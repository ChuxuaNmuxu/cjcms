import {DragSource} from '../drag/createSource'

class resizeSource extends DragSource {
    constructor (spec, monitor) {
        super(spec, monitor)
    }
}

export default (spec, monitor) => new resizeSource(spec, monitor);
