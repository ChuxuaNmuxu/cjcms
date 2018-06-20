export const BEGIN_DRAG = 'BEGIN_DRAG';
export const END_DRAG = 'END_DRAG';
export const HOVER = 'hover'

export function beginDrag (
    sourceInfos,
    options = {clientOffset: null}
) {
	const { clientOffset, getSourceClientOffset } = options

    // const monitor = this.getMonitor();
    const registry = this.getRegistry();

	// let sourceId = null
	// for (let i = sourceIds.length - 1; i >= 0; i--) {
        // 	if (registry.getSource(sourceIds[i]).canDrag()) {
            // 		sourceId = sourceIds[i]
            // 		break
            // 	}
            // }
            
    // 多个drag对象只处理第一个
    const sourceInfo = sourceInfos.find(source => registry.getSource(source.sourceId).canAct())

    if (!sourceInfo) return;

    const {sourceId, options: sourceOptions} = sourceInfo;

    const sourceClientOffset = getSourceClientOffset && getSourceClientOffset(sourceId)

    const source = registry.getSource(sourceId)
    // 自定义beginDrag回调
    const item = source.beginAct()

    // const itemType = registry.getSourceType(sourceId)
    return {
        type: BEGIN_DRAG,
        // itemType,
        item,
        sourceId,
        sourceOptions,
        clientOffset,
        sourceClientOffset
    }
}

export function hover ({ clientOffset = null } = {}) {
    const monitor = this.getMonitor()
	const registry = this.getRegistry()
    const sourceId = monitor.getSourceId();
    if (sourceId) {
        const source = registry.getSource(sourceId, true)
        // 自定义endDrag回调
        // source.endDrag(monitor, sourceId)
        source.acting()
    }
	return {
		type: HOVER,
		clientOffset
	}
}

export function dragEnd () {
    const monitor = this.getMonitor()
	const registry = this.getRegistry()
    
	const sourceId = monitor.getSourceId()
	const source = registry.getSource(sourceId, true)
    // 自定义endDrag回调
	// source.endDrag(monitor, sourceId)
	source.endAct()

	// registry.unpinSource()

	return { type: END_DRAG }
}
