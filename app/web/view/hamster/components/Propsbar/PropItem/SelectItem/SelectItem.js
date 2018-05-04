import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { isObject } from 'lodash';

class SelectItem extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 0
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange (value) {
        console.log(17, value)
        const {onChange} = this.props;
        onChange && onChange(value)
    }

    render() {
        const {value, config, data} = this.props;
        return (
            <Select
              className='select-item'
              value={value}
              placeholder="Basic usage"
              onChange={this.onChange}
              style={{width: '100%'}}
            >
                {
                    data.map(item => {
                        isObject(item) || (item = {label: item, value: item});
                        return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                    })
                }
            </Select>
        );
    }
}

SelectItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array
}

SelectItem.defaultProps = {
    data: []
}

export default SelectItem;
