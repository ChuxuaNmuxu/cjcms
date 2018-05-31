import * as miaow from '../../app/web/view/hamster/Utils/miaow';
import Immutable from 'immutable';
import _ from 'lodash';

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
    .mockReturnValueOnce(false)
    .mockReturnValueOnce('123')
    .mockReturnValueOnce(false)

    const func = () => true
    const func1 = () => 0

    expect(miaow.and(func1, func, func)()).toBe(false)
})

test('test cat', () => {
    expect(miaow.cat(1, Immutable.List([3, 4]), 2, Immutable.List([2, 3]))).toEqual(Immutable.List([1, 3, 4, 2, 2, 3]))
})

test('test getIntersection', () => {
    expect(miaow.getIntersection(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2, 4]), Immutable.List([1, 2, 8]))).toEqual(Immutable.List([1, 2]))
})

test('test getComplement', () => {
    // expect(miaow.getComplement(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2, 4]))).toThrowError('to be relationship of subset')
    expect(miaow.getComplement(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2]))).toEqual(Immutable.List([3]))
})

test('test getDefference', () => {
    // expect(miaow.getComplement(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2, 4]))).toThrowError('to be relationship of subset')
    expect(miaow.getDefference(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2]))).toEqual(Immutable.List([3]))
    expect(miaow.getDefference(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2, 4]))).toEqual(Immutable.List([3]))
})

test.only('test not', () => {
    // expect(miaow.getComplement(Immutable.List([1, 2, 2, 3]), Immutable.List([1, 2, 4]))).toThrowError('to be relationship of subset')

    const a = () => () => true

    const b = args => true

    expect(miaow.not(b)(33)).toEqual(false)
})
