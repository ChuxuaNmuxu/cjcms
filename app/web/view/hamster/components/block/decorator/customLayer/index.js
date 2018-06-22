import {connect} from 'react-redux';
import {flow} from 'lodash';

import {customDragLayer} from './customDragLayer';
import {customResizeLayer} from './customResizeLayer';
import {customRotateLayer} from './customRotateLayer';

const mapStateToProps = (state) => {
    const {hamster} = state;
    return {
        hamster
    }
}

export {
    customDragLayer,
    CustomResizeLayer,
    CustomRotateLayer
}

// customDragLayer的顺序不要更改，里面有过滤hamster
export default options => WrapComponent => flow(
    customDragLayer(options),
    customResizeLayer(options),
    customRotateLayer(options),
    connect(mapStateToProps),
)(WrapComponent);
