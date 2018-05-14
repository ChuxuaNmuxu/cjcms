import React from 'react'
import PropTypes from 'prop-types';

import {BlockItem} from '../../../components/Toolbar';

class Toolbar extends React.Component {
    handleClick = (e) => {
        e.stopPropagation();
        this.fileInput.click();
    }

    handleFileChange = (e) => {
        const {block, hamster} = this.props;
        const resource = e.target.value;
        hamster.addBlock(block.setIn(['data', 'resource'], resource));
        this.fileInput.value = null;
    }

    render () {
        const {block, hamster} = this.props;
        return (<BlockItem block={block} onBtnClick={this.handleClick}>
            <input
              type='file'
              style={{display: 'none'}}
              ref={fileInput => this.fileInput = fileInput}
              onChange={this.handleFileChange}
            />
        </BlockItem>)
    }
}

Toolbar.propTypes = {
    block: PropTypes.object,
    hamster: PropTypes.object
}

export default Toolbar
