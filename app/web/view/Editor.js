import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import {Editor} from './hamster'

/**
 * 使用者建立的编辑页面
 */
class EditorPage extends Component {
    render() {
        return (
            <Editor hamster={this.props.hamster} />
        );
    }
}

EditorPage.propTypes = {
    hamster: PropTypes.any.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        hamster: state.hamster
    }
}

export default connect(mapStateToProps)(EditorPage);