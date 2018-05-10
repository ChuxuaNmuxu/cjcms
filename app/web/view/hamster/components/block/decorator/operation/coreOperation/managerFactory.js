/**
 * Manager工厂函数，保证Manager单例
 */
import manager from './Manager';

const createManager = (options) => class {
    // extendMonitor () {
    //     return extend(Monitor, monitor)
    // }
    constructor () {
        manager.extend(options);
    }

    getBackend () {
        return manager.backend;
    }

    getMonitor () {
        return manager.monitor;
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
