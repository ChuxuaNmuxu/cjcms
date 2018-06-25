import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {Modal, Button} from 'antd'

import configManager from '../../../manager/ConfigManager';
import config from '../../../config';
import BlockMore from './BlockMore'
import BlockWrapper from './BlockWrapper';

// TODO：后续通过configManager获取该配置
const {more} = config.toolbar.blockArea;

/**
 * Toolbar blocks区域
 */
export const BlockArea = (props) => {
    // 过滤不显示的toolbar
    const blocksConfig =  configManager.blocks.filter(block => !!block.get('toolbar'));

    const blocks = blocksConfig.groupBy(
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
