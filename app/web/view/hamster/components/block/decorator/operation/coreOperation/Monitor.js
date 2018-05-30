import Registry from './Registry';
// import invariant from 'invariant';

export default class Monitor {
    constructor (store) {
        this.store = store;
        this.registry = new Registry(store);
    }

    // 订阅store中drag相关数据的变动
    subscribeToStateChange (listener, options = {}) {
        // TODO: 参数校验
        let prevStateId = this.store.getState().stateId;
        const handleChange = () => {
            const currentStateId =  this.store.getState().stateId;

            if (prevStateId !== currentStateId) {
                prevStateId = currentStateId;
                listener()
            }

        }

        // 返回解除监听函数
        return this.store.subscribe(handleChange);
    }

        // 订阅store中offset相关数据的变动
        subscribeToOffsetChange (listener, options = {}) {
            // TODO: 参数校验
            let previousState = this.store.getState().dragOffset
            const handleChange = () => {
                const nextState = this.store.getState().dragOffset
                if (nextState !== previousState) {
                    previousState = nextState;
                    listener()
                }
    
            }
    
            return this.store.subscribe(handleChange)
        }

    // 订阅位置的变动
    subscribeToOffsetChange (listener, options = {}) {
        return this.store.subscribe(listener)
    }

    getState () {
        return this.store.getState();
    }

    isActing () {
        return this.getState().dragOperation.sourceId
    }
}
