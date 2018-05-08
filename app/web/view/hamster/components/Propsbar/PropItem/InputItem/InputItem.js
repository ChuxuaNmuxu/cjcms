import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';;

/**
 * 文本框属性项
 */
class InputItem extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 'a'
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange (value) {
        const {onChange} = this.props;
        onChange && onChange(value)
    }

    render() {
        const {value, config} = this.props;
        return (
            <Input className='input-item' value={value} placeholder="Basic usage" onChange={e => this.onChange(e.target.value)} />
        );
    }
}

InputItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default InputItem;
