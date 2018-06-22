import React from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux'

import SlideComponent from './Component';
import Block from '../block'
import blockActions from '../../actions/slide';
import styles from './Slide.scss';

const mapDispatchToProps = dispatch => {
    return {
        handleMouseDown: () => dispatch(blockActions.slideMouseDown())
    }
}

@connect(null, mapDispatchToProps)
@CSSModules(styles)
class Slide extends React.Component {
    static displayName = 'Slide';

    static Component = SlideComponent;
    
    handleMouseDown = (e) => {
        if (!e.target.classList.contains('cj-slide')) return;

        const {handleMouseDown} = this.props;
        handleMouseDown && handleMouseDown();
    }

    render() {
        return (
            <div styleName='slide-wrap' className='slide-wrap cj-slide' onMouseDown={this.handleMouseDown} >
                <SlideComponent {...this.props} Block={Block} />
            </div>
        );
    }
}

export default Slide;
