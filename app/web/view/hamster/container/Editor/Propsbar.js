import React, { Component } from 'react';
import { connect } from 'react-redux';

import blockActions from '../../actions/block'
import Propsbar from '../../components/Propsbar';
import configManager from '../../manager/ConfigManager';

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
            const {props, layout} = configManager.getBlocksLayout(data)
            this.propsConfig = props;
            this.propsLayout = layout.reverse();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getBlockProps(nextProps);
    }

    handlePropsChange = (value) => {
        const {dispatch, currentBlocks} = this.props;
        dispatch(blockActions.propsChange({blocks: currentBlocks, props: value}))
    }

    render() {
        const {currentBlocks} = this.props;
        return (
            <Propsbar
              onPropsChange={this.handlePropsChange}
              data={currentBlocks.getIn([0, 'data', 'props'])}
              k={currentBlocks.reduce((k, v) => k += v.get('id').substr(-3), '')}
              propsLayout={this.propsLayout}
              propsConfig={this.propsConfig}
            />
        );
    }
}

function mapStateToProps({hamster}) {
    const currentBlockIds = hamster.getIn(['current', 'blocks'])
    const entities = hamster.get('entities')
    const currentBlocks = currentBlockIds.map(id => entities.get(id));
    return {
        currentBlocks
    };
}

export default connect(
    mapStateToProps,
)(PropsbarView);