import * as nodeHelper from '../../app/web/view/hamster/reducers/helper/node';
import Immutable from 'immutable';

const hamster = Immutable.fromJS({
    "objects": {
      "1": {
        "id": "1",
        "type": "block",
        "data": {
            "children": ['2', '3'],
            "parent": null,
        }
      },
      "2": {
        "id": "2",
        "type": "block",
        "data": {
          "children": ['4'],
          "parent": '1',
        }
      },
      "3": {
        "id": "3",
        "type": "block",
        "data": {
          "children": ['5', '6'],
          "parent": '1',
        }
      },
      "4": {
        "id": "4",
        "type": "block",
        "data": {
          "children": [],
          "parent": '2',
        }
      },
      "5": {
        "id": "5",
        "type": "block",
        "data": {
          "children": [],
          "parent": '3',
        }
      },
      "6": {
        "id": "6",
        "type": "block",
        "data": {
          "children": [],
          "parent": '3',
        }
      },
      "7": {
        "id": "7",
        "type": "block",
        "data": {
          "children": [],
          "parent": '3',
        }
      },
      "8": {
        "id": "8",
        "type": "block",
        "data": {
          "children": [],
          "parent": null,
        }
      }
    }
  })

test('test getChildrendIds', () => {
    expect(nodeHelper.getChildrenIds(hamster, '1')).toEqual(Immutable.List(['2', '3']))
})

test('test getParentIds', () => {
    expect(nodeHelper.getParentId(hamster, '2')).toEqual('1')
})

test('test getAncestorId', () => {
    expect(nodeHelper.getAncestorId(hamster, '6')).toEqual('1')
    expect(nodeHelper.getAncestorId(hamster, '1')).toBe(undefined)
})

test('test getLeafIds', () => {
    expect(nodeHelper.getLeafIds(hamster, '1')).toEqual(Immutable.List(['4', '5', '6']))
    expect(nodeHelper.getLeafIds(hamster, '6')).toEqual(Immutable.List())
})

test('test getAllLeafIds', () => {
    expect(nodeHelper.getAllLeafIds(hamster, '6')).toEqual(Immutable.List(['4', '5', '6']))
    expect(nodeHelper.getAllLeafIds(hamster, '8')).toEqual(Immutable.List([]))
    // expect(nodeHelper.getAllLeafIds(hamster, '7')).toEqual(Immutable.List())
})
