import Toolbar from './Toolbar';

export default {
    name: 'audio', // 名称
    title: '音频', // 标题
    icon: 'iconfont icon-audio', // 图标
    description: '点击添加音频', // 描述
    propsbar: null, // 自定义属性栏
    toolbar: Toolbar,
    props: { // 属性

    },
    data: {
        resource: {
            url: '', // sourceId
            name: '' // 文件名
        }
    }
}
