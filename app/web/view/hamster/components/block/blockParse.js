/**
 * 配置解析和属性拦截
 * 假设：所有的配置都拥有相似的结构
 */
import React from 'react';
import configHelper from '../../config/configHelper';
import {Map} from 'immutable';
import {isFunction} from 'lodash';
import baseStyleParser from './parser'

const parser = config => Component => class extends React.Component {
    render () {
        const {block} = this.props;
        // 生成元素的样式对象
        const propsParsed = baseStyleParser(block);

        const props = {
            ...this.props,
            ...propsParsed
        }
        return <Component {...props} />
    }
}

export default parser;
