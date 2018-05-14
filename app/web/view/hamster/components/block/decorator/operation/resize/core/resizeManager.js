import Monitor from './Monitor';
import createManager from '../../coreOperation/managerFactory';
// backend 可以暴露出去由用户定义

const resizeManager = createManager({
    Monitor
})

export default new resizeManager();
