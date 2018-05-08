import React from 'react';
import {Radio} from 'antd'

/**
 * 字体对齐方式属性项
 * @param {*} props 
 */
const TextAlignItem = (props) => {
    const {onChange, value} = props;
    return (
        <Radio.Group onChange={e => onChange(e.target.value)} value={value}>
            <Radio value='left'>left</Radio>
            <Radio value='justify'>justify</Radio>
            <Radio value='right'>right</Radio>
        </Radio.Group>
    )
}

export default TextAlignItem
