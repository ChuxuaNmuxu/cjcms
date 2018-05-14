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

    renderBtn () {
        return <div onClick={this.toggleModal}>
            <i className='iconfont icon-liubianxing' />
            <div>更多</div>
        </div>
    }

    render () {
        const {block} = this.props;
        const blocks = block.get('blocks');
        return (<BlockItem btn={this.renderBtn()}>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              footer={null}
              onCancel={this.toggleModal}
            >
                {
                    blocks.map(
                        block => <BlockWrapper block={block} key={block.get('name')} />
                    )
                }
            </Modal>
        </BlockItem>);
    }
}

export default ({blocks}) => {
    return <BlockWrapper block={Map({toolbar: BlockMoreToolbar, blocks})} />
}
