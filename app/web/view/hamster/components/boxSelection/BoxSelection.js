import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import Region from '../region'

class BoxSelection extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            regions: Immutable.List()
        }
    }
    

    onChange = () => {
        this.setState({
            regions: Immutable.OrderedSet()
        })
    }

    render() {
        const {regions} = this.state;
        const {children} = this.props;
        return <Region 
            regions={regions}
            blockType={'boxSelection'}
            onChange={this.onChange}
            exact={true}
            children={children}
        />
    }
}

export default BoxSelection;