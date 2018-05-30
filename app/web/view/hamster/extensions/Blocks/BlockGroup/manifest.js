import ContainerSection from './components/ContainerSection'

export default {
    name: 'group', // 名称
    title: 'group', // 标题
    icon: '', // 图标
    description: '这是组合元素，不通过工具点击方式栏添加', // 描述
    toolbar: null, // 自定义工具栏
    propsbar: null, // 自定义属性栏
    content: {
        container: { // 单项配置
            editable: true, // 可编辑
            draggable: ContainerSection,
            rotatable: true, // 可旋转的
            resizable: true, // 可变尺寸
            animationEnable: true, // 可以附加动画
            questionEnable: true, // 可以转成习题
            groupEnable: true, // 可以组合
            contextMenu: {}, // 右键菜单
        },
        component: null
    }, // 自定义组件
    props: { // 属性
        // propA: { // 属性项
        //     value: '', // 值
        //     component: null, // 所用控件
        //     validator: [] // 验证规则
        //     // ……
        // }
        border: {
            props: {
                borderStyle: {
                    value: 'solid',
                },
                borderWidth: {
                    value: 1,
                },
                borderColor: {
                    value: '#333',
                }
            }
        }
    }
}
