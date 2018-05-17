import {fromJS, List} from 'immutable'
import initialState from './initialState';

function handleAddBlock (hamster, action) {
    console.log(5, action)
    const {payload: {blocks}} = action;
    const blockIds = blocks.map(block => block.get('id'));
    hamster = hamster.withMutations(hamster => {
        // 添加blocks
        hamster.updateIn(
            ['index', 'blocks'],
            blocks => blocks.concat(blockIds)
        );
        // 添加object
        hamster.update(
            'objects',
            objects => blocks.reduce(
                (acc, block) => objects.set(block.get('id'), block),
                objects
            )
        );
        // 修改current
        hamster.updateIn(
            ['current', 'blocks'],
            blocks => blocks.clear().concat(blockIds)
        )
    })
    return hamster;
}

function handleActivateBlock (hamster, action) {
    // 添加blocks
    const {payload} = action;
    // 修改current
    const handleBlockIds = payload.blockIds;
    hamster = hamster.updateIn(['current', 'blocks'], handleBlockIds)
    return hamster;
}

const merger = (a, b) => {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(merger, b)
    }
    return b
}

function handleChangeProps (hamster, action) {
    const {payload: {blocks}} = action;
    // 修改props
    return hamster.update(
        'objects',
        objects => objects.withMutations(objects => {
            blocks.forEach(block => {
                objects.updateIn(
                    [block.get('id'), 'data', 'props'],
                    props => props.mergeWith(merger, payload.props)
                )
            });
        })
    )
}

function handleEntitiesChanges (hamster, action) {
    const {payload} = action;

    console.log('payload: ', payload)
    console.log('hamster: ', hamster.toJS())

    const {blockIds, operations} = payload;

    if (!blockIds) return hamster;

    return hamster.update('objects', objects => {
        return blockIds.reduce((objects, id) => {
            return operations.reduce((objects, operate, path) => {
                const objectPath = [id].concat(path.split('.'))
                return objects.updateIn(objectPath, prop => operate(prop))
            }, objects)
        }, objects);
    })
}

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state, action) => {
        state = state ? (state.toJS ? state : fromJS(state)) : fromJS(initialState)
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
        }
        return state;
    }
}

const blockType = type => 'BLOCK/' + type;

const block = {
    [blockType('ADD')]: handleAddBlock,
    [blockType('ACTIVATE')]: handleActivateBlock,
    [blockType('PROPS_CHANGE')]: handleChangeProps,
    [blockType('ENTITIES_CHANGE')]: handleEntitiesChanges,
}

export default createReducer(initialState.hamster, block);