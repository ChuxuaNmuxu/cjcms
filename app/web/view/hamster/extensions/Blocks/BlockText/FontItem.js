import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {is} from 'immutable';
import {Select, Checkbox, Radio, Slider, InputNumber, Row, Col} from 'antd'
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

import Color from './Color'

class FontItem extends Component {
    onChange = (name, v) => {
        const {onChange} = this.props;
        onChange && onChange({[name]: v})
    }

    onDecorationChange = (type, checked) => {
        const {value} = this.props;
        let textDecoration = value.get('textDecoration');
        textDecoration = checked ? textDecoration.push(type) : textDecoration.filterNot(v => v === type)
        this.onChange('textDecoration', textDecoration)
    }

    shouldComponentUpdate (nextProps) {
        return !is(nextProps.value, this.props.value);
    }

    render() {
        const {value} = this.props;
        console.log(14, value.toJS())
        const lineHeightProps = {
            min: 1,
            max: 3,
            step: 0.1,
            value: value.get('lineHeight'),
            onChange: v => this.onChange('lineHeight', v)
        }
        return (
            <div>
                <div>
                    字体颜色
                    <Color onChange={v => this.onChange('color', v)} value={value.get('color')} />
                </div>
                <div>
                    字体大小
                    <div>
                        <Select onChange={v => this.onChange('fontSize', v)} value={value.get('fontSize')} style={{width: '100%'}}>
                            <Select.Option value={12}>12</Select.Option>
                            <Select.Option value={14}>14</Select.Option>
                            <Select.Option value={16}>16</Select.Option>
                            <Select.Option value={18}>18</Select.Option>
                            <Select.Option value={20}>20</Select.Option>
                            <Select.Option value={22}>22</Select.Option>
                            <Select.Option value={24}>24</Select.Option>
                        </Select>
                    </div>
                </div>
                <div>
                    格式
                    <Checkbox
                      onChange={e => this.onChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                      checked={value.get('fontWeight') === 'bold'}
                    >
                        bold
                    </Checkbox>
                    <Checkbox
                      onChange={e => this.onChange('fontStyle', e.target.checked ? 'italic' : 'normal')}
                    >
                        italic
                    </Checkbox>
                    <Checkbox
                      onChange={e => this.onDecorationChange('underline', e.target.checked)}
                      checked={value.get('textDecoration').includes('underline')}
                    >
                        underline
                    </Checkbox>
                    <Checkbox
                      onChange={e => this.onDecorationChange('line-through', e.target.checked)}
                      checked={value.get('textDecoration').includes('line-through')}
                    >
                        S
                    </Checkbox>
                </div>
                <div>
                    对齐方式
                    <RadioGroup onChange={e => this.onChange('textAlign', e.target.value)} value={value.get('textAlign')}>
                        <Radio value='left'>left</Radio>
                        <Radio value='justify'>justify</Radio>
                        <Radio value='right'>right</Radio>
                    </RadioGroup>
                </div>
                <div>
                    行高
                    <Row>
                        <Col span={12}>
                            <Slider {...lineHeightProps} />
                        </Col>
                        <Col span={4}>
                            <InputNumber {...lineHeightProps} style={{ marginLeft: 16 }} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

FontItem.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
};

export default FontItem;
