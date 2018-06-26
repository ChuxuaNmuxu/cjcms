import React from 'react';
import {Button} from 'antd';

/**
 * 组属性配置
 * component: string || plainobject || component 所用控件
 */
const props = {
    unite: { // 属性项
        component: (props) => (<Button onClick={() => props.doAction('test', {haha: 1})}>组合</Button>)
    },
}

export default props;
