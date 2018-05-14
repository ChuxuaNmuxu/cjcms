import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {Modal, Button} from 'antd'

import configHelper from '../../../config/configHelper';

import BlockMore from './BlockMore'
import BlockWrapper from './BlockWrapper';

// TODO：后续转移到集中配置的地方
const more = ['audio']

/**
 * Toolbar blocks区域
 */
export const BlockArea = (props) => {
    const blocks = configHelper.blocks.groupBy(
        block => Number(more.indexOf(block.get('name')) > -1)
    );
    return (
        <div className='block-area'>
            {
                blocks.get(0).map(
                    block => <BlockWrapper block={block} key={block.get('name')} />
                )
            }
            {blocks.get(1) && <BlockMore blocks={blocks.get(1)} />}
        </div>
    )
}

BlockArea.propTypes = {

}

export default BlockArea;
