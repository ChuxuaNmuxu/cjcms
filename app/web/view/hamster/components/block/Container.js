import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import styles from './Container.scss';

class BlockContainer extends Component {
    render() {
        const {active, block, blockConfig, children} = this.props;
        let classes = ['block'];
        active && classes.push('active');
        classes = classNames(...classes);

        return (
            <div className={classes} styleName={classes} >
                block容器  
                {children}
            </div>
        );
    }
}

BlockContainer.propTypes = {
    children: PropTypes.node
};

export default CSSModules(BlockContainer, styles, {allowMultiple: true});