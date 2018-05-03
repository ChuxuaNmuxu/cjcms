import React from 'react'

export default {
    title: '边框',
    type: 'object',
    props: {
        borderStyle: {
            title: '类型',
            value: 'none',
            component: {
                type: 'select',
                props: {
                    data: [
                        {label: '无', value: 'none'},
                        {label: '实线', value: 'solid'},
                        {label: '虚线', value: 'dashed'},
                        {label: '点线', value: 'dotted'}
                    ]
                }
            },
            validator: [{
                type: ''
            }, {
                validate: () => {}
            }], // 验证规则
        },
        borderWidth: {
            title: '宽度',
            value: 1,
            component: {
                type: 'slider_and_number',
                props: {
                    max: 20
                }
            },
        },
        borderColor: {
            title: '颜色',
            value: '#333',
            component: 'color'
        }
    }
};
