import Color from './Color'
import FontItem from './FontItem';

export default {
    name: 'text', // 名称
    title: '文本', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '点击添加文本', // 描述
    propsbar: [
        {
            name: 'custom',
            title: '文本',
            layout: [
                'font'
            ]
        }
    ], // 自定义属性栏
    data: {
        content: '', // HTML
        editorState: null 
    },
    props: { // 属性
        font: { // 属性项
            // title: '字体', // 标题
            component: FontItem,
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
                    value: '#FF8C00'
                },
                fontWeight: {
                    value: 'normal'
                },
                textDecoration: {
                    value: []
                },
                lineHeight: {
                    title: '行高',
                    value: 1.3
                }
            }
            // ……
        }
    }
}
