import React from 'react'
import PropTypes from 'prop-types';
import {Modal} from 'antd';

import ToolbarItem from '../../../components/Toolbar/ToolbarItem';

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
        return (<ToolbarItem block={block} onBtnClick={this.handleClick}>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              footer={null}
              onCancel={this.handleClick}
            >
                <p onClick={() => this.handleSelect('square')}>矩形</p>
                <p onClick={() => this.handleSelect('circle')}>圆形</p>
                <p onClick={() => this.handleSelect('star')}>星形</p>
            </Modal>
        </ToolbarItem>)
    }
}

Toolbar.propTypes = {
    block: PropTypes.object,
    hamster: PropTypes.object
}

export default Toolbar
