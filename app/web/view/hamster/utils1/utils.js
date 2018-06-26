/**
 * immutable数据的pick功能
 * @param {*} map 
 * @param {*} keys 
 */
const immrPick = (map, keys) => {
    return map.filter((value, key) => keys.indexOf(key) > -1)
}

export {
    immrPick // immutable数据的pick功能
}
