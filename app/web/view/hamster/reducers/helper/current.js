export const getActivatedBlockIds = (hamster) => {
    return hamster.getIn(['current', 'blocks'])
}