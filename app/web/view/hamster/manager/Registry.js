class Registry {
    constructor () {
        this.container = {}
    }

    registry = (type, options={}) => {
        this.container[type] = options;
    }

    getContainer = (type) => {
        return this.container[type]
    }
}

export default new Registry();
