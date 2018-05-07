import Monitor from './Monitor';
import {createStore} from 'redux';
// import Registry from './Registry';
import {extend} from '../../../../Utils/miaow'

/**
 * Manager工厂函数
 * @param {object} 
 */
const createManager = ({reducers, actions, monitor = {}}) => class Manager {
    constructor (Backend) {
        const store = createStore(reducers);
        this.store = store;
        this.backend = new Backend(this);

        const MixMonitor = this.extendMonitor(Monitor, monitor);
        this.monitor = new MixMonitor(store);
        this.registry = this.monitor.registry;
        // this.registry = new Registry(store);

        this.setupBackend();
    }

    setupBackend () {
        this.backend.setUp();
    }

    extendMonitor () {
        return extend(Monitor, monitor)
    }

    getBackend () {
        return this.backend;
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
