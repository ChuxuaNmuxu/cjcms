/**
 * store操作类
 * 实例化时传入store或每次使用前使用setState更新state
 */
export default class Subscriber {
    constructor (store) {
        this.store = store;
        this.state = {};
    }

    setState (state) {
        this.state = state
    }

    getState () {
        return this.store ? this.store.getState() : this.state;
    }

    getActivatedBlockIds () {
        return this.getState().hamster.getIn(['current', 'blocks'])
    }
}