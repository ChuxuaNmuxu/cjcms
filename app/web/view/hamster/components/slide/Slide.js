import React from 'react';

import SlideComponent from './Component';
import Block from '../block'

class Slide extends React.Component {
    static displayName = 'Slide';

    static Component = SlideComponent;
    
    render() {
        return (
            <SlideComponent {...this.props} Block={Block} />
        );
    }
}

export default Slide;
