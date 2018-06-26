import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {isArray} from 'lodash';
import {Row, Col} from 'antd';
import {List} from 'immutable'

import PropItem from './PropItem';

/**
 * 属性面板，用于显示单个面板的属性配置
 */
class PropsPane extends Component {
    constructor(props) {
        super(props);
    }
    
    onChange = (value) => {
        console.log(6, value)
        const {onChange} = this.props;
        onChange && onChange(value);
    }

    renderItem = (item) => {
        const {value, propsConfig, doAction} = this.props;
        return <PropItem
            value={value.get(item)}
            config={propsConfig.get(item)}
            onChange={this.onChange}
            doAction={doAction}
        />;
    }

    renderItems = (item) => {
        if (!item) {
            return null;
        }
        if (typeof item === 'string') {
            item = List([item]);
        }
        return (<Row key={item.join('-')} gutter={8} style={{marginBottom: 8}}>
            {item.map(subItem =>
                <Col key={subItem} span={24 / item.size}>
                    {this.renderItem(subItem)}
                </Col>
            )}
        </Row>)
    }

    render() {
        return (
            <div>
                {this.props.propsLayout.map(this.renderItems)}
            </div>
        );
    }
}

PropsPane.propTypes = {
    propsConfig: PropTypes.any,
    propsLayout: PropTypes.any,
    value: PropTypes.any,
    onChange: PropTypes.func
};

PropsPane.defaultProps = {
    propsLayout: []
};

export default PropsPane;
