import React from 'react';

import SliderAndNumberItem from '../SliderAndNumberItem'

export const LineHeightItem = (props) => (
    <SliderAndNumberItem min={1} max={3} step={0.1} {...props} />
)

export default LineHeightItem
