/**
 * Manager工厂函数，保证Manager单例
 */
import manager from './Manager';
import Monitor from './Monitor'
import {extend} from '../../../../../utils/miaow';

const createManager = (options) => class {
    constructor () {
        const MixMonitor = extend(Monitor, options.Monitor);
        this.monitor = new MixMonitor(manager.store);
    }

    getBackend () {
        return manager.backend;
    }

    getMonitor () {
        return this.monitor;
    }

    getRegistry () {
        return manager.registry;
    }

    // 通过getActions()[action]调用dispatch(action)
    getActions () {
        return manager.getActions()
    }
}

export default createManager;
