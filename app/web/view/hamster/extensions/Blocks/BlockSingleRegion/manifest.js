import Content from './components'

export default {
    name: 'boxSelection', // 名称
    title: '框选', // 标题
    icon: '', // 图标
    description: '这是款选元素，不通过工具点击方式栏添加', // 描述
    toolbar: null, // 自定义工具栏
    propsbar: null, // 自定义属性栏
    content: {
        container: { // 单项配置
            editable: false, // 可编辑
            draggable: false,
            rotatable: false, // 可旋转的
            resizable: false, // 可变尺寸
            animationEnable: false, // 可以附加动画
            questionEnable: false, // 可以转成习题
            groupEnable: false, // 可以组合
            contextMenu: {}, // 右键菜单
        },
        component: Content
    },
    props: {}
}
