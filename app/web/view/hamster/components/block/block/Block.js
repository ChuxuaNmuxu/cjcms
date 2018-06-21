/**
 * block是纯配置化的，只依赖block和config
 * 解析content的配置，做容器和元素组件的分配
 * @simiao
 * 20180425
 */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import blockActions from '../../../actions/block';
import getDefaultBlock from './helper';

// @withHamster()
// @styleParser()
// @DragSource('block', spec, collect)
export class Component extends React.Component {
    static displayName = 'Block';

    static propTypes = {
        block: PropTypes.object,
        active: PropTypes.bool,
        // hamster: PropTypes.object,
        // clickBlock: PropTypes.func
    }

    constructor(props, context) {
        super(props, context);
        
        const {block} = props;
        const Block = getDefaultBlock(block.getIn(['data', 'type']));

        this.state = {
            Block
        }
    }
    
    shouldComponentUpdate (nextProps) {
        // 过滤children
        const {block, active} = this.props;
        const {block: nextBlock, active: nextActive} = nextProps;

        return active !== nextActive || (block !== nextBlock && !block.equals(nextBlock));
    }

    // handleClick = (e) => {
    //     const {block, clickBlock} = this.props;
    //     const blockId = block.get('id');

    //     // hamster.blockManager.clickBlock({event: e, blockId});
    //     clickBlock && clickBlock({event: e, blockId});
    // }

    render () {
        const {children, ...rest} = this.props;
        const {Block} = this.state;
        // const props = {
        //     ...rest,
        //     clickBlock: this.handleClick
        // }

        return <Block {...rest} />
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clickBlock: (payload) => dispatch(blockActions.click(payload))
    }
}

export default connect(null, mapDispatchToProps)(Component);
// CSSModules(Component, styles, {allowMultiple: true})
