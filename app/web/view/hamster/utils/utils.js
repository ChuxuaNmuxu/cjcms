const immrPick = (map, keys) => {
    return map.filter((value, key) => keys.indexOf(key) > -1)
}

export {
    immrPick
}
