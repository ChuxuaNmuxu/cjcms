export const BEGIN_DRAG = 'BEGIN_DRAG';
export const END_DRAG = 'END_DRAG';

export function beginDrag (
    sourceIds,
    options = {clientOffset: null}
) {
	const { clientOffset, getSourceClientOffset } = options

    const monitor = this.getMonitor();
    const registry = this.getRegistry();

    // 多个drag对象只处理其中一个即可
	let sourceId = null
	for (let i = sourceIds.length - 1; i >= 0; i--) {
		if (monitor.canDragSource(sourceIds[i])) {
			sourceId = sourceIds[i]
			break
		}
    }
    
    if (sourceId === null) return;

    const sourceClientOffset = getSourceClientOffset && getSourceClientOffset(sourceId)

    const source = registry.getSource(sourceId)
    // 自定义beginDrag回调
	const item = source.beginDrag(monitor, sourceId)

    return {
        type: BEGIN_DRAG,
        item,
        sourceId,
        clientOffset,
        sourceClientOffset
    }
}

export function dragEnd (state, action) {
    const monitor = this.getMonitor()
	const registry = this.getRegistry()
    
	const sourceId = monitor.getSourceId()
	const source = registry.getSource(sourceId, true)
    // 自定义endDrag回调
	source.endDrag(monitor, sourceId)

	// registry.unpinSource()

	return { type: END_DRAG }
}
