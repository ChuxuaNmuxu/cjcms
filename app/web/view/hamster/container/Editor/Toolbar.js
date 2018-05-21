import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import Toolbar from '../../components/Toolbar'

class ToolbarView extends Component {
    render() {
        return (
            <Toolbar />
        );
    }
}

ToolbarView.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
    return {
        prop: state.prop
    }
}

export default connect(mapStateToProps)(ToolbarView);