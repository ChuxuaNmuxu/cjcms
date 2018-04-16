export default {
    name: 'text', // 名称
    title: '文本', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '点击添加文本', // 描述
    propsbar: null, // 自定义属性栏
    data: {
        content: '', // HTML
        editorState: null 
    },
    props: { // 属性
        font: { // 属性项
            title: '字体', // 标题
            textAlign: {
                value: 'left'
            },
            fontSize: {
                value: 18
            },
            fontStyle: {
                value: 'none'
            },
            fontFamily: {
                value: 'none'
            },
            color: {
                value: 'left'
            },
            fontWeight: {
                value: 'normal'
            },
            textDecoration: {
                value: []
            }
            // ……
        },
        lineHeight: {
            title: '行高',
            value: 1.3
        }
    }
}
