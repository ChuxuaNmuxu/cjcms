import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {pick} from 'lodash'
import {connect} from 'react-redux'

import Viewport from '../../components/Viewport'

class ViewportView extends Component {
    render() {
        const props = pick(this.props, ['blockIds', 'entities', 'currentBlocks']);
        return (
            <Viewport {...props} />
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