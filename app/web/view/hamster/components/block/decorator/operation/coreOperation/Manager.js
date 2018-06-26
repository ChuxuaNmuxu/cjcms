import {createStore} from 'redux';
// import Registry from './Registry';

import Monitor from './Monitor';
import reducers from './reduces'
import * as actions from './actions/dragDrop';
import Backend from '../backend'
// import {extend} from '../../../../../utils/miaow';

/**
 * Manager工厂函数
 * @param {object} 
 */
// const createManager = ({reducers, actions, monitor = {}}) => 

class Manager {
    constructor (Backend) {
        const store = createStore(reducers);
        this.store = store;
        
        // const MixMonitor = this.extendMonitor(Monitor, monitor);
        // this.monitor = new MixMonitor(store);
        this.monitor  = new Monitor(store);
        this.registry = this.monitor.registry;
        // this.registry = new Registry(store);
        
        this.backend = new Backend(this);
        this.setupBackend();
    }

    setupBackend () {
        this.backend.setUp();
    }

    // manager扩展，目前只支持monitor
    // extend (options={}) {
    //     this.extendMonitor(options.Monitor)
    // }

    // extendMonitor (monitor = {}) {
    //     const MixMonitor = extend(Monitor, monitor);
    //     this.monitor = new MixMonitor(this.store);
    // }

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

export default new Manager(Backend);
