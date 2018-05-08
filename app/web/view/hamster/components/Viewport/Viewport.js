import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';

import styles from './Viewport.scss';
import Block from './Block';
import CustomDragLayer from './CustomDragLayer';

export class Component extends React.Component {
    render () {
        const {blockIds, currentBlocks, objects} = this.props;
        return (
            <div className='viewport' styleName='viewport'>
                <div className='reveal'>
                    <div className='slides'>
                        <section className='section'>
                            {/* <CustomDragLayer /> */}
                            {
                                blockIds.map(id =>
                                    <Block
                                      key={id}
                                      block={objects.get(id)}
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

Component.propTypes = {
    blocks: PropTypes.any,
    currentBlocks: PropTypes.any
}

const mapStateToProps = ({hamster}) => {
    return {
        currentBlocks: hamster.getIn(['current', 'blocks']),
        objects: hamster.get('objects')
    }
}

export default connect(mapStateToProps)(CSSModules(Component, styles));
