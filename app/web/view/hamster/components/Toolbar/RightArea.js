import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd'

import { withHamster } from '../../manager';

@withHamster()
class RightArea extends React.Component {
    handleUnite = () => {
        const {hamster} = this.props;
        hamster.blockManager.groupUnite()
    }

    render() {
        return (
            <div className='right-area'>
                右边区域
                <Button onClick={this.handleUnite}>
                    合并元素
                </Button>
            </div>
        )
    }
}

RightArea.propTypes = {

};

export {RightArea}
export default RightArea;
