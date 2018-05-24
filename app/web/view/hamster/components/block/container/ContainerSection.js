import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './ContainerSection.scss';
import styleParser from '../decorator/style';

@styleParser()
@CSSModules(styles, {allowMultiple: true})
class ContainerSection extends Component {
    static displayName = 'ContainerSection'

    static propTypes = {
        config: PropTypes.object,
        children: PropTypes.node,
        handleClick: PropTypes.func
    }

    handleClick = e => {
        const {handleClick} = this.props;
        handleClick && handleClick(e)
    }

    render() {
        console.log(233, this.props)

        const {block, active, children, style={}} = this.props;

        let classes = ['wrap'];
        active && classes.push('active');
        classes = classNames(...classes);

        // 临时状态，权重更高
        const currentStyle = {
            borderColor: active ? 'red' : style.borderColor
        }
        const containerStyle = Object.assign({}, style, currentStyle);

        return (
            <div className={classes} styleName={classes} style={containerStyle} onClick={this.handleClick} >
                {
                    children
                }
            </div>
        )
    }
}

export default ContainerSection;
