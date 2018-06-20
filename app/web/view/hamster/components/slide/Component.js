import React from 'react';
import PropTypes from 'prop-types';

import {Component as blockComponent} from '../block';

const Component = props => {
    const {blockIds, activatedIds, entities, Block=blockComponent} = props;
    return (
        <React.Fragment>
            {
                blockIds.map(id => <Block
                  key={id}
                  block={entities.get(id)}
                  active={activatedIds.includes(id)}
                />)
            }
        </React.Fragment>
    )
}

Component.propTypes = {
    blockIds: PropTypes.any,
    activatedIds: PropTypes.any,
    entities: PropTypes.any,
    Block: PropTypes.node
};

export default Component;
