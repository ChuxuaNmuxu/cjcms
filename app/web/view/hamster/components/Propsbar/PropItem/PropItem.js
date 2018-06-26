import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {upperFirst, camelCase, isString} from 'lodash';
import {Map} from 'immutable'
import InputItem from './InputItem';
import PropsGroupItem from './PropsGroupItem';

/**
 * 用于处理属性项
 * 1. 加载对应的类型的属性项
 * 2. 向外传递加工后的属性值
 */
class PropItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Item: null
        }
    }

    /**
     * 属性值变化事件
     * 向外输出的结构：{propName: propValue}
     */
    onChange = (value) => {
        const {onChange, config} = this.props;
        onChange && onChange({[config.get('name')]: value})
    }

    /**
     * 动态加载组件
     * @param {*} Comp 
     */
    loadComp (Comp) {
        Comp = upperFirst(camelCase(Comp));
        return import(`./${Comp}Item`).then(module => module.default).catch(e => console.log(e))
    }

    async componentDidMount () {
        const {config} = this.props;
        console.log(21, config.get('props'))
        // 优先级：配置的组件 -> 默认组件
        let Comp = config.get('component') || (config.get('props') ? PropsGroupItem : InputItem);

        if (Map.isMap(Comp)) {
            let componentProps = Comp.get('props').toJS();
            let Comps = await this.loadComp(Comp.get('type'));
            Comp = props => <Comps {...componentProps} {...props} />;
        } else if (isString(Comp)) {
            Comp = await this.loadComp(Comp);
        }

        this.setState({
            Item: Comp
        })
    }

    render() {
        const {config, value, doAction} = this.props;
        const {Item} = this.state;
        return (
            <div>
                {config.get('title')}
                {Item ? <Item config={config} value={value} onChange={this.onChange} doAction={doAction} /> : null}
            </div>
        );
    }
}

PropItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.any,
};

export default PropItem;