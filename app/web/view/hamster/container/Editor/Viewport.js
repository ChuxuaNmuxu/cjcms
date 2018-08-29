import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {pick} from 'lodash'
import {connect} from 'react-redux'
import {withHamster} from '../../manager'

import Viewport from '../../components/Viewport'

@withHamster()
class ViewportView extends Component {
    componentDidMount () {
        // 事件绑定
        const {hamster} = this.props;
        hamster.on('beforeDrag', e => {
            console.log(14, event)
            console.log(15, e)
            // if (e.ctrlKey) {
                // 复制
                console.log('copy')
            // }
        })
    }

    render() {
        const props = pick(this.props, ['blockIds', 'entities', 'currentBlocks']);
        return (
            <Viewport {...props} ref={e => {this.veiwport = e}} tabindex='0' />
        );
    }
}

ViewportView.propTypes = {
    blockIds: PropTypes.any,
    entities: PropTypes.any,
    currentBlocks: PropTypes.any
};

const mapStateToProps = ({hamster}) => {
    return {
        blockIds: hamster.getIn(['index', 'blocks']),
        entities: hamster.get('entities'),
        currentBlocks: hamster.getIn(['current', 'blocks']),
    }
}

export default connect(mapStateToProps)(ViewportView);
