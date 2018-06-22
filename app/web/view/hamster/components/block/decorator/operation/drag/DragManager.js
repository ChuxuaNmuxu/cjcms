import reducers from '../coreOperation/reduces'
import * as actions from '../coreOperation/actions/dragDrop';
import Monitor from './Monitor';
import createManager from '../coreOperation/managerFactory';

const DragDropManager = createManager({
    Monitor
})

export default new DragDropManager();
