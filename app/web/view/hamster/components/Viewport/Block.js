import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './Block.scss';
import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils';
import blockPraser from '../block/blockParse';
import {fromJS} from 'immutable';

const handleClick = (e, block) => {
    BlockUtils.activateBlock([block.get('id')]);
}

export const Component = (props) => {
    console.log('props', props)
    const {block, active, style} = props;
    let classes = ['block'];
    active && classes.push('active');
    classes = classNames(...classes);
    return (
        <div className={classes} styleName={classes} onClick={e => handleClick(e, block)} style={style} >
            <h4>{block.getIn(['data', 'type'])}</h4>
            <hr />
            {
                block.getIn(['data', 'props']).map((v, k) => <p key={k}>{`${k}：${v}`}</p>).toList()
            }
        </div>
    )
}

Component.propTypes = {
    block: PropTypes.any,
    active: PropTypes.bool
}

export default blockPraser()(
    CSSModules(Component, styles, {allowMultiple: true})
);
