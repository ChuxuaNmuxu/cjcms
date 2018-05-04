import React from 'react';
import {Slider, InputNumber, Row, Col} from 'antd'

const commonProps = ({min, max, step, value, onChange}) => ({
    min,
    max,
    step,
    value,
    onChange
})

export const SliderAndNumberItem = (props) => {
    return (
        <Row>
            <Col span={12}>
                <Slider {...commonProps(props)} />
            </Col>
            <Col span={4}>
                <InputNumber {...commonProps(props)} style={{ marginLeft: 16 }} />
            </Col>
        </Row>
    )
}

SliderAndNumberItem.defaultProps = {
    min: 0,
    max: 10,
    step: 1
}

export default SliderAndNumberItem
