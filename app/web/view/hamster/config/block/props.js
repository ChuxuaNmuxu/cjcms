/**
 * 默认属性配置
 * 备忘：属性未定义component的则不在属性栏中显示
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
        title: '边框',
        type: 'object',
        props: {
            borderStyle: {
                value: 'none',
                component: 'select', // string || component 所用控件
                validator: [{
                    type: ''
                }, {
                    validate: () => {}
                }], // 验证规则
            },
            borderWidth: {
                value: 0
            },
            borderColor: {
                value: '#fff'
            }
        }
    },
    opacity: {
        title: '透明度',
        value: 100,
        component: 'input'
    },
    rotation: {
        title: '旋转角度',
        value: 0
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
