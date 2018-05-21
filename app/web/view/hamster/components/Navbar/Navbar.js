import React from 'react';
import CSSModules from 'react-css-modules';

import {Button} from 'antd';
import styles from './Navbar.scss';
import BlockUtils from '../../Utils/BlockUtils';

const handleUnite = () => {
    BlockUtils.groupUnite()
}

export const Component = (props) => {

    return (
        <div className='navbar' styleName='navbar'>
            我是导航栏
            <Button onClick={handleUnite}>
                合并元素
            </Button>
        </div>
    )
}

export default CSSModules(Component, styles);
