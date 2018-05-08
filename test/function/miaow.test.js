import * as miaow from '../../app/web/view/hamster/Utils/miaow';

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
