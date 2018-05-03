/**
 * 默认属性配置
 * component: string || plainobject || component 所用控件
 */
const props = {
    width: { // 属性项
        title: '宽度', // 标题，可支持自定义模板
        value: 0, // 值
        validator: [{
            type: 'number'
        }]
    },
    height: {
        title: '长度', // 标题，可支持自定义模板
        value: 0, // 值
        validator: [{
            type: 'number'
        }]
    },
    left: {
        title: '左边距', // 标题，可支持自定义模板
        value: 0, // 值
        validator: [{
            type: 'number'
        }],
        formatter: () => {}
    },
    top: {
        title: '上边距', // 标题，可支持自定义模板
        value: 0, // 值
        validator: [{
            type: 'number'
        }]
    },
    border: {
        widget: 'border'
    },
    opacity: {
        title: '透明度',
        value: 100,
        component: {
            type: 'slider_and_number',
            props: {
                max: 100
            }
        }
    },
    rotation: {
        title: '旋转角度',
        value: 0,
        component: {
            type: 'slider_and_number',
            props: {
                max: 360
            }
        }
    },
    animation: {
        widget: 'animation'
    },
    zIndex: {
        title: '层级',
        value: 10
    }
}

export default props;
