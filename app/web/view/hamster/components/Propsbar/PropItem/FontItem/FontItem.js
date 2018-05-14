import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {is} from 'immutable';

import ColorItem from '../ColorItem'
import FontSizeItem from './FontSizeItem'
import TextAlignItem from './TextAlignItem'
import LineHeightItem from './LineHeightItem'
import FontStyleItem from './FontStyleItem'

/**
 * 字体属性项
 */
class FontItem extends Component {
    onChange = (name, v) => {
        const {onChange} = this.props;
        onChange && onChange({[name]: v})
    }

    shouldComponentUpdate (nextProps) {
        return !is(nextProps.value, this.props.value);
    }

    itemProps = name => ({
        onChange: v => this.onChange(name, v),
        value: this.props.value.get(name)
    })

    render() {
        const {value} = this.props;
        console.log(14, value.toJS())
        return (
            <div>
                <div>
                    字体颜色
                    <ColorItem {...this.itemProps('color')} />
                </div>
                <div>
                    字体大小
                    <FontSizeItem {...this.itemProps('fontSize')} />
                </div>
                <div>
                    格式
                    <FontStyleItem onChange={this.onChange} value={value} />
                </div>
                <div>
                    对齐方式
                    <TextAlignItem {...this.itemProps('textAlign')} />
                </div>
                <div>
                    行高
                    <LineHeightItem {...this.itemProps('lineHeight')} />
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
