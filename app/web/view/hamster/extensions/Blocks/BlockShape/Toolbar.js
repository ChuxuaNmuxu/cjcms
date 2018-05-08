import React from 'react'
import PropTypes from 'prop-types';
import {Modal} from 'antd';

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

    handleOk = () => {
        const {block, hamster} = this.props;
        const shapeType = 'square';
        hamster.addBlock(block.setIn(['data', 'shapeType'], shapeType))
    }

    render () {
        const {block, hamster} = this.props;
        return (
            <div onClick={this.handleClick}>
                <i className='iconfont icon-liubianxing' /><br />
                形状&nbsp;
                <Modal
                  title="Basic Modal"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleClick}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}

Toolbar.propTypes = {
    block: PropTypes.object,
    hamster: PropTypes.object
}

export default Toolbar
