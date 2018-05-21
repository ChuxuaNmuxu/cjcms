import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import CSSModules from 'react-css-modules';

import styles from './Navbar.scss';
import { withHamster } from '../../manager';

@withHamster()
@CSSModules(styles)
class Navbar extends Component {
    handleUnite = () => {
        const {hamster} = this.props;
        hamster.blockManager.unite()
    }

    render() {
        return (
            <div className='navbar' styleName='navbar'>
                我是导航栏
                <Button onClick={this.handleUnite}>
                    合并元素
                </Button>
            </div>
        );
    }
}

Navbar.propTypes = {

};

export default Navbar;
