import block from './block'

test('hhhhhhhh', () => {
    console.log(block)
    expect(block.add(123)).toEqual({
        type: 'BLOCK/ADD',
        payload: 123,
        meta: undefined
    })
})