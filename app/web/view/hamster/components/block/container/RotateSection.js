import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import {fromJS} from 'immutable'
import {connect} from 'react-redux'

import rotateSource from '../decorator/operation/rotate';
import styles from './RotateSection.scss'
import {isValidateReactComponent} from '../../../Utils/miaow'
import blockActions from '../../../actions/block';
import { getRotateAngle, getBlockCenterOffset } from '../../../utils/block';

const spec = {
    init: function (props, monitor) {
        this.block = props.block;
        this.initialClientOffset = monitor.getInitialClientOffset();

        // this.blockCenterOffset = getBlockCenterOffset(this.block, this.initialClientOffset)
        return true;
    },

    beginRotate: (props) => {
        // 计算一些初始值
        const {beginRotate, block} = props;

        const item = {
            type: 'rotating',
            blockId: block.get('id'),
            initBlock: block
        };

        beginRotate && beginRotate(fromJS(item))

        return item;
    },

    rotate: function (props, monitor) {
        if (!this.isInit) {
            this.isInit = this.init(props, monitor)
        }

        const clientOffset = monitor.getClientOffset();
        const rotateAngle = getRotateAngle(this.block, this.initialClientOffset, clientOffset)

        const {rotate, block} = props;
        const blockId = block.get('id');
        rotate && rotate(fromJS({
            rotateAngle,
            blockId
        }));
    },

    canRotate: (props, monitor, component) => {
        const {canRotate} = props;
        
        return canRotate ? canRotate(props, monitor) : true;
    },

    endRotate: function (props, monitor, component) {
        const {block, rotateEnd} = props;
        const blockId = block.get('id');

        // const axelHeight = component.querySelector('.axle').getBoundingClientRect().height;
        // const radius = component.querySelector('.handle').getBoundingClientRect().height / 2;

        // 旋转半径
        // TODO: 轴高+旋转点半径为一个常量，不需要动态取
        // const rotateRadius = blockHeight / 2 + axelHeight + radius;

        const clientOffset = monitor.getClientOffset();
        const rotateAngle = getRotateAngle(this.block, this.initialClientOffset, clientOffset)

        rotateEnd && rotateEnd(fromJS({
            rotateAngle,
            blockId
        }));

        this.isInit = false;
    }
}

const collect = (monitor, connector) => ({
    rotateSource: connector.connect()
})


@rotateSource('container', spec, collect)
@CSSModules(styles)
class RotateSection extends React.Component {
    static displayName = 'RotateSection'

    static propTypes = {
        rotateSource: PropTypes.func,
        config: PropTypes.any,
        block: PropTypes.object,
        active: PropTypes.bool,
        beginRotate: PropTypes.func,
        rotateEnd: PropTypes.func
    }

    shouldComponentUpdate () {
        return false;
    }

    render() {
        const {rotateSource, config, ...rest} = this.props;

        if (!config) return null;

        const RotateComponent = config;
        if (isValidateReactComponent(RotateComponent)) return <RotateComponent {...rest}/>

        return (
            <div styleName='rotate-wrap' className='rotate-wrap'>
                    <div className="axle" />
                {
                    rotateSource(<div className="handle" />)
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps)  => {
    return {
        beginRotate: (payload) => dispatch(blockActions.actStart(payload)),
        canRotate: () => ownProps.active,
        rotateEnd: (payload) => dispatch(blockActions.rotateEnd(payload))
    }
}

export {RotateSection}
export default connect(null, mapDispatchToProps)(RotateSection);
