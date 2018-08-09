import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {connect} from 'react-redux'

import Region from '../region'
import { withHamster } from '../../manager';
import blockActions from '../../actions/block';

const mapDispatchToProps = (dispatch) => {
    return {
        handleBoxSelect: payload => dispatch(blockActions.boxSelect(payload))
    }
}

@connect(null, mapDispatchToProps)
@withHamster()
class BoxSelection extends Component {
    static propTypes = {
        children: PropTypes.node
    };

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            regions: Immutable.List()
        }
    }
    

    onChange = (region) => {
        this.setState({
            regions: Immutable.OrderedSet()
        })

        // 款选组件加载reveal上，block是相对于slide定位的，需要减去两者之间的位置偏移
        const {hamster} = this.props;
        const revealContainer = hamster.registry.getContainer('reveal');
        const slideContainer = hamster.registry.getContainer('slide');


        const containerOffset = {
            top: slideContainer.top - revealContainer.top,
            left: slideContainer.left - revealContainer.left
        }

        // top, left 有可能为负值
        const box = region.withMutations(region => 
            region
            .update('top', top => top - containerOffset.top)
            .update('left', left => left - containerOffset.left)
        )

        const {handleBoxSelect} = this.props;
        handleBoxSelect && handleBoxSelect(box)
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
