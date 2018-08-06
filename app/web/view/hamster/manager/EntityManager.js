import uuid from 'uuid';
import { fromJS } from 'immutable';

import HamsterManager from './HamsterManager'
import blockActions from '../actions/entity';

class EntityManager extends HamsterManager {
    changeEntitiesProps (entityIds, props) {
        return this.dispatch(blockActions.propsChange({
            entityIds,
            props
        }))
    }

    changeEntities (ids, operations) {
        return this.dispatch(blockActions.entitiesChange(fromJS({
            ids,
            operations
        })))
    }
}

export default EntityManager
