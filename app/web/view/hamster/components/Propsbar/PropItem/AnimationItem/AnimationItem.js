import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Select } from 'antd';
const RadioGroup = Radio.Group;
const SOption = Select.Option;

const onChange = () => {};

/**
 * 动画属性项
 */
class AnimationItem extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 'a'
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange (name, v) {
        const {onChange} = this.props;
        onChange && onChange({[name]: v})
    }

    render() {
        const {value, config} = this.props;
        return (
            <div className='animation-item'>
                <hr />
                <div>
                    动画效果：<RadioGroup name='effect' onChange={e => this.onChange('effect', e.target.value)} value={value.get('effect')}>
                        <Radio value="none">无</Radio>
                        <Radio value="a">放大进入</Radio>
                        <Radio value="b">缩小进入</Radio>
                        <Radio value="c">淡入</Radio>
                        <Radio value="d">淡出</Radio>
                        <Radio value="e">从下滑入</Radio>
                        <Radio value="f">从上滑入</Radio>
                        <Radio value="g">从右滑入</Radio>
                        <Radio value="h">从左滑入</Radio>
                    </RadioGroup>
                </div>
                <hr />
                <div>
                    触发方式：
                    <Select name='trigger' onChange={v => this.onChange('trigger', v)} value={value.get('trigger')} style={{ width: 120 }}>
                        <Select.Option value="click">单击时触发</Select.Option>
                        <Select.Option value="comeIn">入场时触发</Select.Option>
                    </Select>
                </div>
                <div>
                    播放次序：
                    <Select name='index' onChange={v => this.onChange('index', v)} value={value.get('index')} style={{ width: 120 }}>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                        <Select.Option value="3">3</Select.Option>
                        <Select.Option value="4">4</Select.Option>
                        <Select.Option value="5">5</Select.Option>
                        <Select.Option value="6">6</Select.Option>
                        <Select.Option value="7">7</Select.Option>
                        <Select.Option value="8">8</Select.Option>
                        <Select.Option value="9">9</Select.Option>
                        <Select.Option value="10">10</Select.Option>
                    </Select>
                </div>
            </div>
        );
    }
}

AnimationItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.object,
}

export default AnimationItem;
