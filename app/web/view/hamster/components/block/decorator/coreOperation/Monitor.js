import Registry from './Registry';
// import invariant from 'invariant';

export default class Monitor {
    constructor (store) {
        this.store = store;
        this.registry = new Registry();
        this.props = {};
    }

    // 订阅store中drag相关数据的变动
    subscribeToStateChange (listener, options = {}) {
        // TODO: 参数校验
        let prevStateId = this.store.getState().stateId;
        const handleChange = () => {
            const currentStateId =  this.store.getState().stateId;

            if (prevStateId !== currentStateId) {
                listener()
            }

            prevStateId = currentStateId;
        }

        // 返回解除监听函数
        return this.store.subscribe(handleChange);
    }
}
