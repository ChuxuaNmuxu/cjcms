import React from 'react';
import PropTypes from 'prop-types';

import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils'
import {HamsterContext} from '../../hamster';

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
                  className='block-item'
                  title={block.get('description')}
                  onClick={() => handleClick(block, hamster)}>
                    {
                        Toolbar ? <Toolbar {...{block, hamster}} /> : <div>
                            <i className={block.get('icon')} /><br />
                            {block.get('title')}&nbsp;
                        </div>
                    }
                </div>
            )}
        </HamsterContext.Consumer>
    );
}

Block.propTypes = {
    block: PropTypes.object
}

export const Blocks = (props) => {
    return (
        <div className='blocks'>
            {
                configHelper.blocks.map(block => <Block block={block} key={block.get('name')} />)
            }
        </div>
    )
}

Blocks.propTypes = {
    onAdd: PropTypes.func
}

export default Blocks;
