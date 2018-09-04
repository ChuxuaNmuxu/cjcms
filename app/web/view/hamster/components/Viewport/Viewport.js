import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Viewport.scss';
import Slide from '../slide'
import BoxSelection from '../../components/boxSelection'
// import customDisplayLayler from '../block/decorator/customLayer'
import customLayer from '../block/decorator/customLayer/CustomLayer'
import Snap from '../snap';
import {withHamster} from '../../manager'

// @customDisplayLayler()
@customLayer()
@withHamster()
@CSSModules(styles)
class Viewport extends React.Component {
    componentDidMount () {
        const {hamster} = this.props;
        hamster.registry.registry('viewport', this.viewport);
    }

    render () {
        const {blockIds, currentBlocks, entities, snapCoord} = this.props;

        return (
            <div
              className='viewport'
              styleName='viewport'
              ref={e => {this.viewport = e}}
             >
                <BoxSelection>
                    <div className='reveal'>
                        <div className='slides'>
                            {/* <CustomLayer /> */}
                            <Snap snapCoord={snapCoord}/>
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
