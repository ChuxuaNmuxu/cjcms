import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PropItem from '.';

/**
 * 一组属性的渲染
 * TODO：
 * 1. 样式的处理
 */
class PropsGroupItem extends Component {
    render() {
        const {config, value, onChange} = this.props;
        return (
            <div>
                {
                    config.get('props').map(prop => (
                        <PropItem
                          key={prop.get('name')}
                          config={prop}
                          value={value.get(prop.get('name'))}
                          onChange={onChange}
                        />
                    )).toList()
                }
            </div>
        );
    }
}

PropsGroupItem.propTypes = {

};

export default PropsGroupItem;