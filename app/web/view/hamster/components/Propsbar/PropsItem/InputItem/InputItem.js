import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';;

const onChange = () => {};

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
        return (
            <Input className='input-item' placeholder="Basic usage" onChange={this.onChange} />
        );
    }
}

InputItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.object,
}

export default InputItem;
