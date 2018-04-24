export default {
    name: 'shape', // 名称
    title: '形状', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '点击添加形状', // 描述
    propsbar: null, // 自定义属性栏
    data: {
        content: '', // HTML
        editorState: null,
        shapeType: '' // 形状类型
    },
    props: { // 属性
        color: {
            title: '颜色',
            value: ''
        },
        font: { // 属性项
            title: '字体', // 标题
            props: {
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
            }
            // ……
        },
        lineHeight: {
            title: '行高',
            value: 1.3
        }
    }
}
