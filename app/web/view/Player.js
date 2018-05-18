import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import {Player} from './hamster'

/**
 * 使用者建立的播放页面
 */
class PlayerPage extends Component {
    render() {
        return (
            <Player hamster={this.props.hamster} />
        );
    }
}

PlayerPage.propTypes = {
    hamster: PropTypes.any.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        hamster: state.hamster
    }
}

export default connect(mapStateToProps)(PlayerPage);