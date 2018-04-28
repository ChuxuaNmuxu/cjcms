export default {
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
}