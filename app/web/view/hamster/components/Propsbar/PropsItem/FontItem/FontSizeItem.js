import React from 'react';
import {Select} from 'antd'

const FontSizeItem = (props) => {
    const {onChange, value} = props;
    return(
        <Select onChange={onChange} value={value} style={{width: '100%'}}>
            <Select.Option value={12}>12</Select.Option>
            <Select.Option value={14}>14</Select.Option>
            <Select.Option value={16}>16</Select.Option>
            <Select.Option value={18}>18</Select.Option>
            <Select.Option value={20}>20</Select.Option>
            <Select.Option value={22}>22</Select.Option>
            <Select.Option value={24}>24</Select.Option>
        </Select>
    )
}

export default FontSizeItem;
