import React from 'react';
import {Slider, InputNumber, Row, Col} from 'antd'

const lineHeightProps = ({value, onChange}) => ({
    min: 1,
    max: 3,
    step: 0.1,
    value,
    onChange
})

export const LineHeightItem = (props) => {
    return (
        <Row>
            <Col span={12}>
                <Slider {...lineHeightProps(props)} />
            </Col>
            <Col span={4}>
                <InputNumber {...lineHeightProps(props)} style={{ marginLeft: 16 }} />
            </Col>
        </Row>
    )
}

export default LineHeightItem
