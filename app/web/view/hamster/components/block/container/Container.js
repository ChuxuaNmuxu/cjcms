import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import styles from './Container.scss';

class BlockContainer extends Component {
    render() {
        const {block, active, children, handleClick} = this.props;
        let classes = ['block'];
        active && classes.push('active');
        classes = classNames(...classes);

        return (
            <div className={classes} styleName={classes} onClick={e => handleClick(e, block)} >
                block容器  
                {children}
            </div>
        );
    }
}

BlockContainer.propTypes = {
    children: PropTypes.node,
    block: PropTypes.object,
    handleClick: PropTypes.func,
    active: PropTypes.bool
};

export default CSSModules(BlockContainer, styles, {allowMultiple: true});