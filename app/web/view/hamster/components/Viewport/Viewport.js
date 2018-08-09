import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Viewport.scss';
import Slide from '../slide'
import BoxSelection from '../../components/boxSelection'
// import customDisplayLayler from '../block/decorator/customLayer'
import customLayer from '../block/decorator/customLayer/CustomLayer'
import Snap from '../snap';

// @customDisplayLayler()
@customLayer()
@CSSModules(styles)
class Viewport extends React.Component {
    render () {
        const {blockIds, currentBlocks, entities} = this.props;

        return (
            <div className='viewport' styleName='viewport'>
                <BoxSelection>
                    <div className='reveal'>
                        <div className='slides'>
                            {/* <CustomLayer /> */}
                            <Snap />
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

export default Viewport;
