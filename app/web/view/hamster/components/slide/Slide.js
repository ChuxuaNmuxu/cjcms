import React from 'react';
import CSSModules from 'react-css-modules';

import SlideComponent from './Component';
import Block from '../block'
import styles from './Slide.scss';

@CSSModules(styles)
class Slide extends React.Component {
    static displayName = 'Slide';

    static Component = SlideComponent;

    render() {
        return (
            <div styleName='slide-wrap' className='slide-wrap cj-slide' onMouseDown={this.handleMouseDown} >
                <SlideComponent {...this.props} Block={Block} />
            </div>
        );
    }
}

export default Slide;
