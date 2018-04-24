import React from 'react';
import PropTypes from 'prop-types';
// import CSSModules from 'react-css-modules';
// import classNames from 'classnames';
import {isFunction} from 'lodash';

import styles from './Block.scss';
import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils';
import blockPraser from '../block/blockParse';
import Container from '../block/Container';

const handleClick = (e, block) => {
    BlockUtils.activateBlock([block.get('id')]);
}

export const Component = (props) => {
    // console.log('props', props)
    // const {block, active, style} = props;
    // let classes = ['block'];
    // active && classes.push('active');
    // classes = classNames(...classes);
    // return (
    //     <div className={classes} styleName={classes} onClick={e => handleClick(e, block)} style={style} >
    //         <h4>{block.getIn(['data', 'type'])}</h4>
    //         <hr />
    //         {
    //             block.getIn(['data', 'props']).map((v, k) => <p key={k}>{`${k}：${v}`}</p>).toList()
    //         }
    //     </div>
    // )

    const {block, active, style} = props;
    let classes = ['block'];
    active && classes.push('active');

    const blockConfig = configHelper.getBlock(block.getIn(['data', 'type']));
    const ContentComponent = blockConfig.get('content');

    if (!ContentComponent) return <div>error</div>

    // 默认容器包含组件
    if (React.isValidElement(React.createElement(ContentComponent))) {
        return (
            <Container classes={classes} styleName={classes} onClick={e => handleClick(e, block)} style={style}>
                <ContentComponent block={block} blockConfig={blockConfig} />
            </Container>
        )
    }

    // // 传递函数
    // if (isFunction(ContentComponent)) return ContentComponent({
    //     block,
    //     blockConfig,
    //     Container,
    //     hamster
    // })

    return <Container styleName={classes} classes={classes} styleName={classes}>
        empty
    </Container>

}

Component.propTypes = {
    block: PropTypes.any,
    active: PropTypes.bool
}

export default blockPraser()(
    Component
    // CSSModules(Component, styles, {allowMultiple: true})
);
