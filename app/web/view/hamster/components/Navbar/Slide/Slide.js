import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSModules from 'react-css-modules'

import styles from './Slide.scss'

@CSSModules(styles)
class Slide extends Component {
    render() {
        const {index, data, onContextMenu} = this.props;
        return (
            <div className='slide' styleName='slide' onContextMenu={e => onContextMenu(e, data)}>
                <div className='blank' onContextMenu={e => onContextMenu(e, data, 'header')} />
                <div className='body'>
                    <div className='content'>
                        {index + 1} - {data.get('id')}
                    </div>
                </div>
            </div>
        );
    }
}

Slide.propTypes = {
    data: ImmutablePropTypes.map,
    index: PropTypes.number
};

export default Slide;
