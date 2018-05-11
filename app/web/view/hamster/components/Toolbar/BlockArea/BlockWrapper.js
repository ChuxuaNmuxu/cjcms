import React from 'react';
import PropTypes from 'prop-types';

import {HamsterContext} from '../../../hamster';
import BlockItem from './BlockItem'

const handleClick = (block, hamster) => {
    const onClick = block.get('onClick')
    console.log(12, block.toJS())
    onClick && onClick(block, hamster);
};

const BlockWrapper = (props) => {
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

BlockWrapper.propTypes = {
    block: PropTypes.object
}

export default BlockWrapper;
