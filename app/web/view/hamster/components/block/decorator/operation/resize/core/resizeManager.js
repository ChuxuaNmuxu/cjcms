import reducers from '../../coreOperation/reduces'
import * as actions from '../../coreOperation/actions/dragDrop';
import Monitor from './Monitor';
import createManager from '../../coreOperation/managerFactory';
// backend 可以暴露出去由用户定义
import Backend from '../../Backend';

const resizeManager = createManager({
    Monitor
})

export default new resizeManager();
