import React, { Component } from 'react';
import { connect } from 'react-redux';

import {HAMSTER} from '../../actions/actionTypes';
import Propsbar from './components/Propsbar';
import configHelper from './config/configHelper';

function mapStateToProps({hamster}) {
    const currentBlockIds = hamster.getIn(['current', 'blocks'])
    const objects = hamster.get('objects')
    const currentBlocks = currentBlockIds.map(id => objects.get(id));
    return {
        currentBlocks
    };
}

/**
 * 可能选择多个block，甚至不同类型的block，这种情况要合并处理
 * TODO:
 * 1. 处理多个合并的情况
 */
class PropsbarView extends Component {
    constructor (props) {
        super(props)

        this.getBlockProps(props);
    }

    getBlockProps (props) {
        const {currentBlocks: data} = props;
        this.blockType = !!data.size && data.getIn([0, 'data', 'type']);
        if (this.blockType) {
            const block = configHelper.getBlock(this.blockType);
            this.propsConfig = block.get('props');
            this.propsLayout = block.get('propsbar').reverse();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getBlockProps(nextProps);
    }

    handlePropsChange = (value) => {
        const {dispatch, currentBlocks} = this.props;
        dispatch({
            type: HAMSTER.BLOCK_PROPS_CHANGE,
            payload: {blocks: currentBlocks, props: value}
        });
    }

    render() {
        return (
            <Propsbar
              onPropsChange={this.handlePropsChange}
              data={this.props.currentBlocks}
              propsLayout={this.propsLayout}
              propsConfig={this.propsConfig}
            />
        );
    }
}

export default connect(
    mapStateToProps,
)(PropsbarView);