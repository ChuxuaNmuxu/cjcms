import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import Navbar from '../../components/Navbar';

class NavbarView extends Component {
    render() {
        return (
            <Navbar />
        );
    }
}

NavbarView.propTypes = {

};

export default connect()(NavbarView);