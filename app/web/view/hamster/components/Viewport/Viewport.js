import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Viewport.scss';
import Slide from '../slide'
// import Block from './Block';
// import CustomLayer from '../block/CustomLayer';

import BoxSelection from '../../components/boxSelection'

class Viewport extends React.Component {
    render () {
        const {blockIds, currentBlocks, entities} = this.props;
        // const blocks = entities.filter(entity => blockIds.includes(entity.get('id')));
        return (
            <div className='viewport' styleName='viewport'>
                <BoxSelection>
                    <div className='reveal'>
                        <div className='slides'>
                            {/* <CustomLayer /> */}
                            <section className='section'>
                                <Slide
                                  blockIds={blockIds}
                                  entities={entities}
                                  activatedIds={currentBlocks}
                                />
                            </section>
                        </div>
                    </div>
                </BoxSelection>
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
