import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import {connect} from 'react-redux'

import styles from './ContainerSection.scss';
import styleParser from '../decorator/style';
import blockActions from '../../../actions/block';
import PureContainerComponent from './PureContainerComponent';

@styleParser()
@CSSModules(styles, {allowMultiple: true})
class ContainerSection extends PureContainerComponent {
    static displayName = 'ContainerSection'

    static propTypes = {
        children: PropTypes.node,
        block: PropTypes.object,
        active: PropTypes.bool,
        clickBlock: PropTypes.func,
        style: PropTypes.object
    }

    handleClick = e => {
        const {clickBlock, block} = this.props;
        clickBlock && clickBlock({
            event: e,
            blockId: block.get('id')
        })
    }

    render() {
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
            <div
              id={block.get('id')}
              className={classes}
              styleName={classes}
              style={containerStyle}
              onClick={this.handleClick}
            >
                {
                    children
                }
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clickBlock: (payload) => dispatch(blockActions.click(payload))
    }
}

export {ContainerSection}
export default connect(null, mapDispatchToProps)(ContainerSection);
