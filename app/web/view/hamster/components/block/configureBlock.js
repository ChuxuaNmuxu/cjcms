/**
 * 解析block配置
 * 高阶组件
 */
import React from 'react';
import configHelper from '../../../config/configHelper';
import {Map} from 'immutable';

const configure = Component => class extends React.Component {
    constructor(props) {
        super(props);
        
        this._init();
    }
    
    _init () {
        this._getBlockConfig();
    }

    _getBlockConfig () {
        const {id} = this.props;
        this.blockConfig = configHelper.getBlock(id);
    }

    // _getConfigValue (path) {
    //     return this.blockConfig.getIn(path);
    // }

    _getPropConfig (path) {
        return this.getConfig(['data', 'props'].concat(path));
    }

    _createStyleObject (props, initData) {
        return props.reduce((acc, k, v) => {
            if (Map.isMap(v)) {
                this.createStyleObject(v, acc)
            }

            return acc[k] = this._getPropConfig([k, 'formatter'])(v)
        }, initData)
    }
    
    getStyle () {
        const {block} = this.props;
        const props = block.getIn(['data', 'props']);
        return this._createStyleObject(props, {})
    }

    render () {
        const props = {
            ...this.props,
            blockConfig: this.blockConfig,
            style: this.getStyle()
        }
        return <Component {...props} />
    }
}

export default configure;
