export default class Backend {
    constructor (manager) {
        this.actions = manager.getActions()
		this.monitor = manager.getMonitor()
        // this.registry = manager.getRegistry()
        
        this.sourceNodes = [];
        this.dragStartSource = [];
        this.sourcePreview = [];
    }

    get window () {
        return window
    }

    //为dom添加drag事件并缓存
    connectSource (sourceId, node, options) {
        this.sourceNodes[sourceId] = node;

		const handleDragStart = e => this.handleDragStart(e, sourceId, options)
		// const handleSelectStart = e => this.handleSelectStart(e, sourceId)

        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', handleDragStart);
        // node.addEventListener('selectstart', handleSelectStart);

        return () => {
            Reflect.deleteProperty(this.sourceNodes, sourceId);

            node.removeEventListener('dragstart', handleDragStart)
            // 兼容IE
			// node.removeEventListener('selectstart', handleSelectStart)
			node.setAttribute('draggable', false)
        }
    }

    connectDragPreview (sourceId, node) {
        this.sourcePreview[sourceId] = node;
        
        return () => {
            Reflect.deleteProperty(this.sourcePreview, sourceId);
        }
    }

    setUp () {
        if (this.window === undefined || this.window.__isReactDndBackendSetUp) return ;
		this.window.__isReactDndBackendSetUp = true
		this.addEventListeners(this.window)
    }

    addEventListeners (target) {
        if (!target.addEventListener) return;

        target.addEventListener('dragstart', this.handleTopDragStart)
		// target.addEventListener('dragstart', this.handleTopDragStartCapture)
		target.addEventListener('dragend', this.handleTopDragEnd)
    }

    handleDragStart (e, sourceId, options) {
        // 事件冒泡等同时触发多个drag事件
        this.dragStartSource.push({sourceId, options})
    }

    handleTopDragStart = (e) => {
        const {dragStartSource} = this;

        this.dragStartSource = [];
        // 鼠标位置
        const clientOffset = this.getEventClientOffset(e);

        this.actions.beginDrag(dragStartSource, {
            clientOffset,
            sourceClientOffset: this.getSourceClientOffset
        })

        // TODO: 拖拽展示图片
        // const {dataTransfer} = e;

        // TODO: 拖动过程中，dom节点被移除，drag事件中断，需要手动处理dragEnd事件

    }

    handleTopDragEnd = () => {
        this.actions.dragEnd()
    }

    getEventClientOffset (e) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }

    getSourceClientOffset (sourceId) {
        const node = this.sourceNodes[sourceId];

        if (!node) return null;
        const {top, left} = node.getBoundingClientRect()
        return {
            x: left,
            y: top
        }
    }

    getSourceNode (sourceId) {
        return this.sourceNodes(sourceId);
    }
}
