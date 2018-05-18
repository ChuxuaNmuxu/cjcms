import uuid from 'uuid';
import { fromJS } from 'immutable';

import HamsterManager from './HamsterManager'

class EntityManager extends HamsterManager {
    createEntity (type, data) {
        return fromJS({
            id: `${type}-${uuid.v4()}`,
            type,
            data
        })
    }
}

export default EntityManager
