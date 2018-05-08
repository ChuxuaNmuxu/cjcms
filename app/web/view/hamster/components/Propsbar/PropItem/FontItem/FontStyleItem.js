import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from 'antd'

/**
 * 字体样式属性项
 * 包含：加粗、斜体、下划线、删除线
 */
class FontStyleItem extends Component {
    onDecorationChange = (type, checked) => {
        const {value, onChange} = this.props;
        let textDecoration = value.get('textDecoration');
        textDecoration = checked ? textDecoration.push(type) : textDecoration.filterNot(v => v === type)
        onChange('textDecoration', textDecoration)
    }

    itemProps = (name, v) => ({
        onChange: e => this.props.onChange(name, e.target.checked ? v : 'normal'),
        checked: this.props.value.get(name) === v
    })

    decorationProps = v => ({
        onChange: e => this.onDecorationChange(v, e.target.checked),
        checked: this.props.value.get('textDecoration').includes(v)
    })
 
    render () {
        const {value, onChange} = this.props;
        return (
            <div>
                <Checkbox {...this.itemProps('fontWeight', 'bold')}>
                    bold
                </Checkbox>
                <Checkbox {...this.itemProps('fontStyle', 'italic')}>
                    italic
                </Checkbox>
                <Checkbox {...this.decorationProps('underline')}>
                    underline
                </Checkbox>
                <Checkbox {...this.decorationProps('line-through')}>
                    S
                </Checkbox>
            </div>
        )
    }
}

export default FontStyleItem
