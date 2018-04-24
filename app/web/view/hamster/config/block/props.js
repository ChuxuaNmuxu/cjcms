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
        title: '动画',
        component: 'animation',
        props: {
            effect: {
                title: '效果',
                value: 'none'
            },
            duration: {
                title: '间隔',
                value: 0
            },
            delay: {
                title: '延迟',
                value: 0
            },
            index: {
                title: '播放次序',
                value: 0,
            },
            trigger: {
                title: '触发方式',
                value: 'click',
            }
        }
    },
    zIndex: {
        title: '层级',
        value: 10
    }
}

export default props;
