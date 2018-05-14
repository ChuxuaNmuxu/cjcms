import Demo from '../BlockDemo/component/Demo';
import Toolbar from './Toolbar';

export default {
    name: 'shape', // 名称
    title: '形状', // 标题
    icon: 'iconfont icon-liubianxing', // 图标
    description: '点击添加形状', // 描述
    toolbar: Toolbar, // 自定义工具栏
    propsbar: [ // 自定义属性栏
        {
            name: 'custom',
            title: '形状',
            layout: [
                'font'
            ]
        }
    ],
    content: {
        // container: {
        //     editable: false, // 可编辑
        //     rotatable: false, // 可旋转的
        //     resizable: false // 可变尺寸
        // },
        container: false,
        component: Demo
    },
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
        font: {
            widget: 'font'
        },
        lineHeight: {
            title: '行高',
            value: 1.3
        }
    }
}
