import {fromJS} from 'immutable'
import uuid from 'uuid'

const createEntity = (type, data) => {
    return fromJS({
        id: `${type}-${uuid.v4()}`,
        type,
        data
    })
}

export {
    createEntity
}
