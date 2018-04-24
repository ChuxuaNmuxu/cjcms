import props from './props';
import propsbar from './propsbar';

/**
 * 默认block配置
 */
const block = {
    name: 'default', // 名称
    title: '默认', // 标题
    icon: 'iconfont icon-link', // 图标
    description: '这是默认元素', // 描述
    onClick: function (block, hamster) {
        console.log(9, '默认点击事件', block.toJS());
        hamster.addBlock(block);
    },
    content: null, // 组件，必需
    toolbar: null, // 自定义工具栏
    propsbar, // 自定义属性栏
    props, // 属性，支持简单编排和自定义组件
}

export default block;
