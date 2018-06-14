import React from 'react';
import PropTypes from 'prop-types';

const Component = props => {
    const {blockIds, activatedIds, entities, children} = props;
    return (
        <React.Fragment>
            {
                blockIds.map(id =>
                    React.cloneElement(children, {
                        key: id,
                        block: entities.get(id),
                        active: activatedIds.includes(id)}
                    )
                )
            }
        </React.Fragment>
    )
}

Component.propTypes = {
    blockIds: PropTypes.any,
    activatedIds: PropTypes.any,
    entities: PropTypes.any,
    children: PropTypes.node
};

export default Component;
