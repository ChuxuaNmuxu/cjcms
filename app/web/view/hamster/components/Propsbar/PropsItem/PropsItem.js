import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

class PropsItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Item: null
        }
    }
    
    onChange = (value) => {
        const {onChange, config} = this.props;
        onChange && onChange({[config.get('name')]: value})
    }

    async componentDidMount () {
        const {config} = this.props;
        const comp = capitalize(config.get('component') || 'input');
        const Item = await import(`./${comp}Item`).then(module => module.default).catch(e => console.log(e))
        this.setState({
            Item
        })
    }

    render() {
        const {config, value} = this.props;
        const name = config.get('name');
        const {Item} = this.state;
        // <input style={{width: '100%'}} name={name} value={value} onChange={this.onChange} />
        return (
            <div>
                {config.get('title')}
                {Item ? <Item config={config} value={value} onChange={this.onChange} /> : null}
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