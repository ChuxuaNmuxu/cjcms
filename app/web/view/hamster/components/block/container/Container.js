import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import styles from './Container.scss';
import resizeSource from '../decorator/operation/resize';
import RotateSpin from './RotateSpin';

const spec = {
    beginResize: (props, monitor, component) => {
        console.log('resizeStart: ', monitor.innerMonitor.store.getState())
    },
    endResize: (props, monitor, component) => {
        console.log('resizeEnd: ', props)
    }
}

const collect = (monitor, connect) => ({
    resizeNorth: connect.resizeNorth(),
    offset: monitor.getOffset()
})

@resizeSource('container', spec, collect)
@CSSModules(styles, {allowMultiple: true})
class BlockContainer extends Component {
    render() {
        console.log('this.props: ', this.props)

        const {block, active, children, handleClick, resizeNorth, style={}} = this.props;

        let classes = ['block'];
        active && classes.push('active');
        classes = classNames(...classes);

        const resizeStyle={
            width: '20px',
            height: '20px',
            position: 'absolute',
            top: '10px',
            background: 'orange'
        }

        return (
            <div className={classes} styleName={classes} style={style}  onClick={e => handleClick(e, block)} >
                block容器
                {
                    resizeNorth(<div style={resizeStyle}>
                        一路向北
                    </div>)
                }
                <RotateSpin />
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

export default BlockContainer;