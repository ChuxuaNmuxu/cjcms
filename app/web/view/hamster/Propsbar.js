import React, { Component } from 'react';
import { connect } from 'react-redux';

import {HAMSTER} from '../../actions/actionTypes';
import Propsbar from './components/Propsbar';
import configHelper from './config/configHelper';

/**
 * 可能选择多个block，甚至不同类型的block，这种情况要合并处理
 * TODO:
 * 1. 处理多个合并的情况，后续移到通用库里
 */
class PropsbarView extends Component {
    constructor (props) {
        super(props)

        this.getBlockProps(props);
    }

    getBlockProps (props) {
        const {currentBlocks: data} = props;
        if (data.size) {
            const {props, layout} = configHelper.getBlocksLayout(data)
            this.propsConfig = props;
            this.propsLayout = layout.reverse();
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

function mapStateToProps({hamster}) {
    const currentBlockIds = hamster.getIn(['current', 'blocks'])
    const objects = hamster.get('objects')
    const currentBlocks = currentBlockIds.map(id => objects.get(id));
    return {
        currentBlocks
    };
}

export default connect(
    mapStateToProps,
)(PropsbarView);