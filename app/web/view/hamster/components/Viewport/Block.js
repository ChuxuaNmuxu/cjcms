import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './Block.scss';
import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils';

const handleClick = (e, block) => {
    console.log(9, e, block.toJS());
    console.log(10, configHelper.getBlock(block.get('type')).toJS());
    BlockUtils.activateBlock([block.get('id')]);
}

export const Component = ({block, active}) => {
    let classes = ['block'];
    active && classes.push('active');
    classes = classNames(...classes);
    console.log(20, block.get('props').toJS())
    return (
        <div className={classes} styleName={classes} onClick={e => handleClick(e, block)}>
            <h4>{block.get('type')}</h4>
            <hr />
            {
                block.get('props').map((v, k) => <p key={k}>{`${k}：${v}`}</p>).toList()
            }
        </div>
    )
}

Component.propTypes = {
    block: PropTypes.any,
    active: PropTypes.bool
}

export default CSSModules(Component, styles, {allowMultiple: true});
