import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {upperFirst, camelCase, isString, isPlainObject} from 'lodash';
import {Map} from 'immutable'
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

    loadComp (Comp) {
        Comp = upperFirst(camelCase(Comp));
        return import(`./${Comp}Item`).then(module => module.default).catch(e => console.log(e))
    }

    async componentDidMount () {
        const {config} = this.props;
        console.log(21, config.get('props'))
        let Comp = config.get('component') || (config.get('props') ? PropsGroupItem : 'input');

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