import StoreManager from './StoreManager'

class HamsterManager extends StoreManager {
    constructor (hamster) {
        super(hamster.getStore())

        this.hamster = hamster;
    }
}

export default HamsterManager
