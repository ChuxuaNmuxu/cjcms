import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Viewport.scss';
import Block from './Block';
import CustomDragLayer from './CustomDragLayer';

export class Viewport extends React.Component {
    render () {
        const {blockIds, currentBlocks, entities} = this.props;
        return (
            <div className='viewport' styleName='viewport'>
                <div className='reveal'>
                    <div className='slides'>
                        <section className='section'>
                            <CustomDragLayer />
                            {
                                blockIds.map(id =>
                                    <Block
                                      key={id}
                                      block={entities.get(id)}
                                      active={currentBlocks.includes(id)}
                                    />
                                )
                            }
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

Viewport.propTypes = {
    blockIds: PropTypes.any,
    entities: PropTypes.any,
    currentBlocks: PropTypes.any
}

export default CSSModules(Viewport, styles);
