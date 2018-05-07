import Monitor from './Monitor';
import {createStore} from 'redux';

/**
 * Manager工厂函数
 * @param {object} 
 */
const createManager = ({reducers, actions, Monitor = Monitor}) => class Manager {
    constructor (Backend) {
        const store = createStore(reducers);
        this.store = store;
        this.backend = new Backend(this);
        this.monitor = new Monitor(store);
        this.registry = this.monitor.registry;

        this.setupBackend();
    }

    setupBackend () {
        this.backend.setUp();
    }

    getBackend () {
        return this.monitor;
    }

    getMonitor () {
        return this.monitor;
    }

    getRegistry () {
        return this.registry;
    }

    // 通过getActions()[action]调用dispatch(action)
    getActions () {
        const manager = this
		const { dispatch } = this.store

		function bindActionCreator(actionCreator) {
			return (...args) => {
				const action = actionCreator.apply(manager, args)
				if (typeof action !== 'undefined') {
					dispatch(action)
				}
			}
		}

		return Object.keys(actions)
			.filter(key => typeof actions[key] === 'function')
			.reduce((boundActions, key) => {
				const action = actions[key]
				boundActions[key] = bindActionCreator(action)
				return boundActions
			}, {})
    }
}

export default createManager;
