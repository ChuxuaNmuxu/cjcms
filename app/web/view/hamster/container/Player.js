import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StoreProvider from '../core/StoreProvider'

@StoreProvider
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

export default Player;
