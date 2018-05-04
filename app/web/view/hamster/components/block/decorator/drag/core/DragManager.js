import Backend from '../Backend';
import Moniter from './Moniter';
import {createStore} from 'redux';
import reducers from './reduces'
import * as dragDropActions from './actions/dragDrop';

class DragDropManager {
    constructor () {
        const store = createStore(reducers);
        console.log('store: ', store)
        this.store = store;
        this.backend = new Backend(this);
        this.monitor = new Moniter(store);
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

    getActions () {
        const manager = this
        console.log('manager: ', manager)
		const { dispatch } = this.store

		function bindActionCreator(actionCreator) {
			return (...args) => {
				const action = actionCreator.apply(manager, args)
				if (typeof action !== 'undefined') {
					dispatch(action)
				}
			}
		}

		return Object.keys(dragDropActions)
			.filter(key => typeof dragDropActions[key] === 'function')
			.reduce((boundActions, key) => {
				const action = dragDropActions[key]
				boundActions[key] = bindActionCreator(action)
				return boundActions
			}, {})
    }
}

export default new DragDropManager();
