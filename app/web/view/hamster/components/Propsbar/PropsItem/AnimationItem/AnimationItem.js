import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Select } from 'antd';
const RadioGroup = Radio.Group;
const SOption = Select.Option;

const onChange = () => {};

class AnimationItem extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 'a'
        }

        console.log(17, props.value)
        console.log(18, props.config)
        this.onChange = this.onChange.bind(this);
    }

    onChange (name, v) {
        console.log(19, name, v)
        const {onChange} = this.props;
        onChange && onChange({[name]: v})
    }

    render() {
        return (
            <div className='animation-item'>
                <hr />
                <div>
                    动画效果：<RadioGroup name='effect' onChange={e => this.onChange('effect', e.target.value)} defaultValue={this.state.value}>
                        <Radio value="a">Hangzhou</Radio>
                        <Radio value="b">Shanghai</Radio>
                        <Radio value="c">Beijing</Radio>
                        <Radio value="d">Chengdu</Radio>
                    </RadioGroup>
                </div>
                <hr />
                <div>
                    触发方式：
                    <Select name='trigger' onChange={v => this.onChange('trigger', v)} defaultValue="lucy" style={{ width: 120 }}>
                        <Select.Option value="jack">Jack</Select.Option>
                        <Select.Option value="lucy">Lucy</Select.Option>
                        <Select.Option value="Yiminghe">yiminghe</Select.Option>
                    </Select>
                </div>
                <div>
                    播放次序：
                    <Select name='index' onChange={v => this.onChange('index', v)} defaultValue="lucy" style={{ width: 120 }}>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                        <Select.Option value="3">3</Select.Option>
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
