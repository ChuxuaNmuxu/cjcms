/**
 * hamster功能子集
 */
import Shortcut from '../../reducers/helper/Shortcut';

export default class Subscriber {
    constructor (store) {
        this.store = store;
    }

    getStore () {
        return this.store;
    }

    getState (stateName) {
        const state = this.store.getState()
        return stateName ? state[stateName] : state;
    }

    getHamster () {
        return this.getState('hamster');
    }

    getActivatedBlockIds () {
        return Shortcut.getActivatedBlockIds(this.getHamster());
    }
}