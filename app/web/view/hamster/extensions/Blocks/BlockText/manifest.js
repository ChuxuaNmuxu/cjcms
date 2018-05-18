import React from 'react';

export default {
    name: 'text', // 名称
    title: '文本', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '点击添加文本', // 描述
    content: (context) => <div>context</div>,
    propsbar: [ // 自定义属性栏
        {
            name: 'custom',
            title: '文本',
            layout: [
                'font'
            ]
        }
    ],
    data: {
        content: '', // HTML
        editorState: null
    },
    props: { // 属性
        font: {
            widget: 'font'
        },
        border: {
            props: {
                borderStyle: {
                    value: 'solid',
                },
                borderWidth: {
                    value: 1,
                },
                borderColor: {
                    value: '#333',
                }
            }
        }
    }
}
