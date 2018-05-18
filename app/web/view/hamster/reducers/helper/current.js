export const getActivedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}