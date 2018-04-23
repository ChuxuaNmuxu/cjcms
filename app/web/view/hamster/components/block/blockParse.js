/**
 * 配置解析和属性拦截
 * 假设：所有的配置都拥有相似的结构
 */
import React from 'react';
import configHelper from '../../config/configHelper';
import {Map} from 'immutable';
import {isFunction} from 'lodash';
import baseStyleParser from './parser'

// export class Component extends React.Component {

// }

const parser = config => Component => class extends React.Component {
    // constructor(props) {
    //     super(props);
        
    //     this._init();
    // }
    
    // // 初始化
    // _init () {
    //     this._getconfig();
    // }

    // /**
    //  * 获取对应配置
    //  */
    // _getconfig () {
    //     const {block} = this.props;
    //     this.config = configHelper.getBlock(block.getIn(['data', 'type']));
    // }

    // _getConfig (path) {
    //     return this.config.getIn(path);
    // }

    
    // /**
    //  * 获取props下某属性的配置
    //  * @param {String | Array} path 
    //  */
    // _getPropConfig (path) {
    //     return this._getConfig(['data', 'props'].concat(path));
    // }

    // /**
    //  * 处理嵌套的属性
    //  * @param {Map} props 
    //  * @param {Map} propsConfig
    //  * @param {Map} initData
    //  */
    // _handleNestProps (props, propsConfig, initData) {
    //     return props.reduce((acc, v, k) => {
    //         // 判断有嵌套
    //         const formatter = propsConfig.getIn([k, 'formatter']);
    //         if (Map.isMap(v) && !formatter) {
    //             this._handleNestProps(v, propsConfig.getIn([k, 'props']), acc);
    //         }
    //         acc[k] = formatter &&  isFunction(formatter) ? formatter(v) : null
    //         return acc;
    //     }, initData)
    // }

    // /**
    //  * 生成style对象
    //  */ 
    // getStyle () {
    //     const {block} = this.props;
    //     console.log('block:', block)
    //     const props = block.getIn(['data', 'props']);
    //     const propsConfig = this.config.get('props');
    //     return this._handleNestProps(props, propsConfig, {});
    // }

    render () {
        const {block} = this.props;
        const propsParsed = baseStyleParser(block);

        const props = {
            ...this.props,
            ...propsParsed
        }
        return <Component {...props} />
    }
}

export default parser;
