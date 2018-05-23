import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import Immutable, {fromJS} from 'immutable';
import installDevTools from 'immutable-devtools';
import createSagaMiddleware from 'redux-saga'

import rootReducer from '../reducers';
import rootSaga from '../sagas';

// 调试工具
const composeEnhancers = composeWithDevTools({
    // 后续如需配置参数，可在这里配置
});

const toJS = state => {
    let newState = fromJS(state);
    return newState.toJS ? newState.toJS() : newState;
}

// 日志
const logger = createLogger({
    duration: true,
    collapsed: true,
    stateTransformer: (state) => {
        let newState = {};

        for (var i of Object.keys(state)) {
            newState[i] = toJS(state[i]);
        };

        return newState;
    },
    actionTransformer: (action) => {
        let newAction = Object.assign({}, action);

        if (newAction.payload) {
            newAction.payload = toJS(newAction.payload)
        }

        return newAction;
    }
});

const saga = createSagaMiddleware()

const middleware = [saga, thunk, logger];

const configureStore = (preloadedState = {}) => {
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    )

    saga.run(rootSaga);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            store.replaceReducer(rootReducer);
        });
    }

    return store;
}

export default configureStore;
