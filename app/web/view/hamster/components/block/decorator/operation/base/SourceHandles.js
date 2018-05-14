export default class SourceHandles {
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
}
