import React from 'react'
import PropTypes from 'prop-types';
import {Modal, Button} from 'antd';

import BlockItem from '../../../components/Toolbar/BlockItem';

class Toolbar extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    handleClick = (e) => {
        e.stopPropagation();

        this.setState({visible: !this.state.visible});
    }

    handleSelect = (shapeType) => {
        const {block, hamster} = this.props;
        hamster.addBlock(block.setIn(['data', 'shapeType'], shapeType))
        this.setState({visible: !this.state.visible});
    }

    render () {
        const {block, hamster} = this.props;
        return (<BlockItem block={block} onBtnClick={this.handleClick}>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              footer={null}
              onCancel={this.handleClick}
            >
                <Button onClick={() => this.handleSelect('square')}>矩形</Button>
                <Button onClick={() => this.handleSelect('circle')}>圆形</Button>
                <Button onClick={() => this.handleSelect('star')}>星形</Button>
            </Modal>
        </BlockItem>)
    }
}

Toolbar.propTypes = {
    block: PropTypes.object,
    hamster: PropTypes.object
}

export default Toolbar
