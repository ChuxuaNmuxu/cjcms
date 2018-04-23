/**
 * 默认属性配置
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
        }]
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
                }] // 验证规则
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
        value: 100
    },
    rotation: {
        title: '旋转角度',
        value: 0
    },
    animation: {
        title: '动画',
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
            }
        },
        index: {
            title: '播放次序',
            value: 0,
        },
        trigger: {
            title: '触发方式',
            value: 'click',
        },
        formatter: value => {
            /**
             * 入场时触发返回正常动画
             * 点击触发返回reveal自定义属性
             */ 
            const trigger = value.getIn(['props', 'trigger']);
            if (trigger === 'click') {
                return {
                    className: value.get('effect'),
                    'data-fragment-index': value.get('index')
                } ;
            }
            return value.get('props').reduce((acc, v, k) => {
                const formatter = v.formatter; 
                const value = v.get('alue');

                if (formatter) return `${acc} ${formatter(value)}`
                return acc
            } , 'forwards')
        }
    },
    zIndex: {
        title: '层级',
        value: 10
    }
}

export default props;
