import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PropItem from '.';

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