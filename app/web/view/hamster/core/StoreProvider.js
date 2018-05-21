import React from 'react';
import {Provider} from 'react-redux';
import {pick, omit} from 'lodash';

import createStore from '../core/configureStore'
import initialState from '../reducers/initialState'

const stateKeys = Object.keys(initialState);

const StoreProvider = Component => {
    return class extends React.Component {
        render () {
            const store = createStore(pick(this.props, stateKeys))
            return (
                <Provider store={store}>
                    <Component {...omit(this.props, stateKeys)} />
                </Provider>
            )
        }
    }
}

export default StoreProvider;
