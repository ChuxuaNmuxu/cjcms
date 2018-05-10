export const BEGIN_DRAG = 'BEGIN_DRAG';
export const END_DRAG = 'END_DRAG';

export function beginDrag (
    sourceInfos,
    options = {clientOffset: null}
) {
	const { clientOffset, getSourceClientOffset } = options

    // const monitor = this.getMonitor();
    const registry = this.getRegistry();

    // 多个drag对象只处理其中一个即可
	// let sourceId = null
	// for (let i = sourceIds.length - 1; i >= 0; i--) {
	// 	if (registry.getSource(sourceIds[i]).canDrag()) {
	// 		sourceId = sourceIds[i]
	// 		break
	// 	}
    // }
    
    console.log('sourceInfo: ', sourceInfos)
    const sourceInfo = sourceInfos.find(source => registry.getSource(source.sourceId).canAct())


    if (!sourceInfo) return;

    const {sourceId, sourceOptions} = sourceInfo;

    const sourceClientOffset = getSourceClientOffset && getSourceClientOffset(sourceId)

    const source = registry.getSource(sourceId)
    // 自定义beginDrag回调
	const item = source.beginAct()

    return {
        type: BEGIN_DRAG,
        item,
        sourceId,
        sourceOptions,
        clientOffset,
        sourceClientOffset
    }
}

export function dragEnd () {
    const monitor = this.getMonitor()
	const registry = this.getRegistry()
    
	const sourceId = monitor.getSourceId()
	const source = registry.getSource(sourceId, true)
    // 自定义endDrag回调
	// source.endDrag(monitor, sourceId)
	source.beginAct()

	// registry.unpinSource()

	return { type: END_DRAG }
}
