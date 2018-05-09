import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Toolbar.scss';
import BlockArea from './BlockArea';
import LeftArea from './LeftArea';
import RightArea from './RightArea';

export const Component = (props) => {
    return (
        <div className='toolbar' styleName='toolbar'>
            <LeftArea />
            <BlockArea />
            <RightArea />
        </div>
    )
}

export default CSSModules(Component, styles);
