import * as miaow from '../../app/web/view/hamster/Utils/miaow';
import Immutable from 'immutable';

test('test matching', () => {
    // 模拟函数返回
    const myMock = jest.fn();

    myMock
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce('123')
    .mockReturnValueOnce(true)

    const ret = miaow.dispatchMission(myMock, myMock, myMock)(12);

    expect(myMock.mock.calls).toEqual([[12], [12]])
    expect(ret).toBe('123')
})

// test('test extend', () => {
//     // 模拟函数返回
//     class A {
//         static displayName = 'A'
    
//         constructor (a) {
//             this.a = a
//         }
//     }
    
//     A.prototype.sayA = () => {}
    
//     class AA extends A {
//         state = {3: 3}
    
//         constructor (b) {
//             super (b)
//         }
    
//         sayAA () {}
//     }
    
//     const a = new A();
//     const aa = new AA();

//     class C {}

//     expect(miaow.extend(C, AA).displayName).toBe('A')
// })

test('test add', () => {
    const myMock = jest.fn();

    const add1 = miaow.add(1);

    const addArray = miaow.add([1])

    const addMap = miaow.add(Immutable.Map({
        a: 1
    }))

    const addObject =  miaow.add({
        a: 1
    })

    expect(add1(2)).toBe(3)
    expect(addArray([5])).toEqual([5, 1])
    expect(addMap(Immutable.Map({b: 2}))).toEqual(Immutable.Map({
        a: 1,
        b: 2
    }))
    expect(addObject({b: 2})).toEqual({
        a: 1,
        b: 2
    })

    expect(miaow.add(2)({a: 2})).toEqual('[object Object]2')
    expect(miaow.add(2)(Immutable.Map({a: 2}))).toEqual('Map { \"a\": 2 }2')
})

test('test minus', () => {
    const minus1 = miaow.minus(1);

    const minusArray = miaow.minus([5])

    const minusMap = miaow.minus(Immutable.Map({
        a: 1
    }))

    const minusObject =  miaow.minus({
        a: 1
    })

    expect(minus1(2)).toBe(1)
    expect(minusArray([5, 1])).toEqual([1])
})

test('test and', () => {
    const myMock = jest.fn();

    myMock
    .mockReturnValueOnce(1)
    .mockReturnValueOnce('123')
    .mockReturnValueOnce(true)

    const func = () => true

    expect(miaow.and(func, false, func)()).toBe(true)
})

