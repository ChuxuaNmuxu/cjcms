/**
 * 默认属性配置
 * component: string || plainobject || component 所用控件
 */
const props = {
    background: {
        props: {
            color: {
                title: '背景颜色',
                value: 'none'
            },
            image: {
                title: '背景图片',
                value: 0
            },
            size: {
                title: '布局方式',
                value: 'contain'
            },
        }
    },
    animation: {
        widget: 'animation'
    },
}

export default props;
