import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {isArray} from 'lodash';
import {Row, Col} from 'antd';
import {List} from 'immutable'

import PropsItem from './PropsItem';
import configHelper from '../../config/configHelper';

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
        const {value, blockProps} = this.props;
        return <PropsItem
            value={value.get(item)}
            config={blockProps.get(item)}
            onChange={value => this.onChange(value)}
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
                <Col key={subItem} span={24 / item.length}>
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
    blockProps: PropTypes.any,
    propsLayout: PropTypes.any,
    value: PropTypes.any,
    onChange: PropTypes.func
};

PropsPane.defaultProps = {
    propsLayout: []
};

export default PropsPane;
