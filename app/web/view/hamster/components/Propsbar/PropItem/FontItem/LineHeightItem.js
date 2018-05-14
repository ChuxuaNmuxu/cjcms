import React from 'react';

import SliderAndNumberItem from '../SliderAndNumberItem'

/**
 * 行高属性项
 * @param {*} props 
 */
export const LineHeightItem = (props) => (
    <SliderAndNumberItem min={1} max={3} step={0.1} {...props} />
)

export default LineHeightItem
