import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PropsItem extends Component {
    onChange = (e) => {
        const {onChange, config} = this.props;
        onChange && onChange({[config.get('name')]: e.target.value})
    }
    render() {
        const {config, value} = this.props;
        const name = config.get('name');
        return (
            <div>
                {config.get('title')}
                <input style={{width: '100%'}} name={name} value={value} onChange={this.onChange} />
            </div>
        );
    }
}

PropsItem.propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.any,
};

export default PropsItem;