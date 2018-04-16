export default {
    name: 'line', // 名称
    title: '线条', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '点击添加线条', // 描述
    propsbar: null, // 自定义属性栏
    data: {
        nodes: [], // 节点信息
        content: '', // HTML
    },
    props: { // 属性
        startPoint: {
            title: '起点样式',
            value: 'none'
        },
        endPoint: {
            title: '终点样式',
            value: 'none'
        },
        lineColor: {
            title: '线条颜色',
            value: '#000'
        },
        lineWidth: {
            title: '线条宽度',
            value: 2
        },
        lineStyle: {
            title: '线条样式',
            value: 'solid'
        }
    }
}
