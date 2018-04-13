/**
 * 默认属性配置
 */
const props = {
    propA: { // 属性项
        name: 'propA',
        title: '属性A',
        value: 111, // 值
        component: null, // 所用控件
        validator: [] // 验证规则
        // ……
    }
}

/**
 * 默认block配置
 */
export default {
    name: 'default', // 名称
    title: '默认', // 标题
    icon: 'iconfont icon-link', // 图标
    description: '这是默认元素', // 描述
    onClick: function (block, hamster) {
        console.log(9, '默认点击事件', block.toJS());
        hamster.addBlock(block);
    },
    toolbar: null, // 自定义工具栏
    propsbar: null, // 自定义属性栏
    props // 属性
}