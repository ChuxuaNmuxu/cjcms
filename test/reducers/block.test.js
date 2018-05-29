import * as blockHelper from '../../app/web/view/hamster/reducers/helper/block';
import Immutable from 'immutable';

test('test get', () => {
    const fourDimension = {
        left: 100,
        top: 100,
        width: 100,
        height: 100
    }

    const offset = {
        width: 100,
        height: 100
    }

    // const pointToCoordinate = {
    //     'nw': {x: 0, y: 0},
    //     'sw': {x: 0, y: 1},
    //     'ne': {x: 1, y: 0},
    //     'se': {x: 1, y: 1}
    // }

    expect(blockHelper.pin(fourDimension, offset, 'nw')).toEqual({
        left: 100,
        top: 100,
        width: 200,
        height: 200
    })

    expect(blockHelper.pin(fourDimension, offset, 'sw')).toEqual({
        left: 100,
        top: 0,
        width: 200,
        height: 200
    })

    expect(blockHelper.pin(fourDimension, offset, 'ne')).toEqual({
        left: 0,
        top: 100,
        width: 200,
        height: 200
    })

    expect(blockHelper.pin(fourDimension, offset, 'se')).toEqual({
        left: 0,
        top: 0,
        width: 200,
        height: 200
    })

    expect(blockHelper.pin(fourDimension, offset, {x: 0.5, y: 0.5})).toEqual({
        left: 50,
        top: 50,
        width: 200,
        height: 200
    })
})
