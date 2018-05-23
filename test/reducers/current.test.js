import * as currentHelper from '../../app/web/view/hamster/reducers/helper/current';
import Immutable from 'immutable';

const hamster = Immutable.fromJS({
    "current": {
        "blocks": [
            "1",
            "4",
            "7",
            "8",
            "9",
        ]
        // "blocks": [
        //     "7",
        // ]
    },
    "objects": {
      "1": {
        "id": "1",
        "type": "block",
        "data": {
            "children": ['2', '3'],
            "parent": '',
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
          "parent": null,
        }
      },
      "8": {
        "id": "8",
        "type": "block",
        "data": {
          "children": ['9'],
          "parent": null,
        }
      },
      "9": {
        "id": "9",
        "type": "block",
        "data": {
          "children": [],
          "parent": '8',
        }
      },
    }
  })

test('test getChildrendIds', () => {
    expect(currentHelper.getAncestorInCurrent(hamster)).toEqual(Immutable.List(['1', '8']))
    // expect(currentHelper.getAncestorInCurrent(hamster)).toEqual(Immutable.List([]))
})

test('test removeAncestorInCurrent', () => {
    expect(currentHelper.removeAncestorInCurrent(hamster)).toEqual(Immutable.List(['4', '7', '9']))
    // expect(currentHelper.getAncestorInCurrent(hamster)).toEqual(Immutable.List([]))
})
