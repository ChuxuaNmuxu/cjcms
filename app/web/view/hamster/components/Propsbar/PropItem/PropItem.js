import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {capitalize, isString} from 'lodash';
import PropsGroupItem from './PropsGroupItem';

class PropItem extends Component {
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
        console.log(21, config.get('props'))
        let Comp = config.get('component') || (config.get('props') ? PropsGroupItem : 'input');

        if (isString(Comp)) {
            Comp = capitalize(Comp);
            Comp = await import(`./${Comp}Item`).then(module => module.default).catch(e => console.log(e))
        }

        this.setState({
            Item: Comp
        })
    }

    render() {
        const {config, value} = this.props;
        const name = config.get('name');
        const {Item} = this.state;
        return (
            <div>
                {config.get('title')}
                {Item ? <Item config={config} value={value} onChange={this.onChange} /> : null}
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