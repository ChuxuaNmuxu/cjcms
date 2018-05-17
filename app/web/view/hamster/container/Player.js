import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createProvider from '../Utils/tmp'

class Player extends Component {
    render() {
        return (
            <div>
                我是player
            </div>
        );
    }
}

Player.propTypes = {

};

export default createProvider(Player);
