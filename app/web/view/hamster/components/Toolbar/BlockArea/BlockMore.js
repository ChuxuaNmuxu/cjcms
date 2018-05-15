import React from 'react';
import {Map} from 'immutable'
import {Modal} from 'antd'

import BlockWrapper from './BlockWrapper'
import BlockItem from './BlockItem'

/**
 * Toolbar 更多block项
 */
class BlockMoreToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    toggleModal = (e) => {
        e.stopPropagation();
        this.setState({visible: !this.state.visible});
    }
    
    showModal = e => {
        e.stopPropagation();
        this.setState({visible: true});
    }

    hideModal = e => {
        e.stopPropagation();
        this.setState({visible: false});
    }

    renderBtn () {
        return <div onMouseOver={this.showModal} onMouseOut={this.hideModal}>
            <i className='iconfont icon-liubianxing' />
            <div>更多</div>
        </div>
    }

    render () {
        const {block} = this.props;
        const blocks = block.get('blocks');
        return (<BlockItem btn={this.renderBtn()}>
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                border: '1px solid #e8e8e8',
                padding: 15,
                width: 255,
                zIndex: 1000,
                textAlign: 'left',
                display: this.state.visible ? 'block': 'none'
            }} onMouseOver={this.showModal} onMouseOut={this.hideModal}>
            {
                blocks.map(
                    block => <BlockWrapper block={block} key={block.get('name')} />
                )
            }
            </div>
        </BlockItem>);
    }
}

export default ({blocks}) => {
    return <BlockWrapper block={Map({toolbar: BlockMoreToolbar, blocks})} />
}
