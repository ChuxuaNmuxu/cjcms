export function getDifferenceFromInitialOffset(dragOffset) {
    const { clientOffset, initialClientOffset } = dragOffset
    if (!clientOffset || !initialClientOffset) {
        return null
    }
    return {
        x: clientOffset.x - initialClientOffset.x,
        y: clientOffset.y - initialClientOffset.y,
    }
}
