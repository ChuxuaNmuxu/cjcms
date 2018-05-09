import React from 'react';
import PropTypes from 'prop-types';

import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils'
import {HamsterContext} from '../../hamster';
import BlockItem from './BlockItem';

const handleClick = (block, hamster) => {
    const onClick = block.get('onClick')
    onClick && onClick(block, hamster);
};

const Block = (props) => {
    const {block} = props;
    const Toolbar = block.get('toolbar');
    return (
        <HamsterContext.Consumer>
            {hamster => (
                <div
                  className='block-item-wrapper'
                  title={block.get('description')}
                  onClick={() => handleClick(block, hamster)}>
                    {
                        Toolbar ? <Toolbar {...{block, hamster}} /> : <BlockItem block={block} />
                    }
                </div>
            )}
        </HamsterContext.Consumer>
    );
}

Block.propTypes = {
    block: PropTypes.object
}

export const BlockArea = (props) => {
    return (
        <div className='block-area'>
            {
                configHelper.blocks.map(
                    block => <Block block={block} key={block.get('name')} />
                )
            }
        </div>
    )
}

BlockArea.propTypes = {

}

export default BlockArea;
