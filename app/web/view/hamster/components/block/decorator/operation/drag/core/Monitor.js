/**
 * 将合并到核心monitor，可以扩展或复写核心monitor的方法
 * 也可以用于不同操作间通信
 */
export default class Monitor {
    getSourceId () {
        return this.getState().dragOperation.sourceId;
    }
}