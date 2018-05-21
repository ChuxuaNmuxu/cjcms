import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {pick} from 'lodash'
import {connect} from 'react-redux'

import Viewport from '../../components/Viewport'

class ViewportView extends Component {
    render() {
        const props = pick(this.props, ['blockIds', 'objects', 'currentBlocks']);
        return (
            <Viewport {...props} />
        );
    }
}

ViewportView.propTypes = {
    blockIds: PropTypes.any,
    blocks: PropTypes.any,
    currentBlocks: PropTypes.any
};

const mapStateToProps = ({hamster}) => {
    return {
        blockIds: hamster.getIn(['index', 'blocks']),
        objects: hamster.get('objects'),
        currentBlocks: hamster.getIn(['current', 'blocks']),
    }
}

export default connect(mapStateToProps)(ViewportView);