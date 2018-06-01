import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rotateSource from '../decorator/operation/rotate';
import CSSModules from 'react-css-modules'
import styles from './RotateSection.scss'
import {fromJS} from 'immutable'
import {getAngleByThreeCoord} from '../../../Utils/miaow'

let centerClientOffset = {}

const spec = {
    canRotate: (props, monitor, component) => {
        const {block} = props;
        const blockId = block.get('id');
        const activatedId = props.hamster.getActivatedBlockIds();
        
        return activatedId.includes(blockId);
    },

    endRotate: (props, monitor, component) => {
        const blockId = props.block.get('id');
        const rotation = props.block.getIn(['data', 'props', 'rotation']);
        const blockHeight = props.block.getIn(['data', 'props', 'height']);
        const blockWidth = props.block.getIn(['data', 'props', 'width']);


        const axelHeight = component.querySelector('.axle').getBoundingClientRect().height;
        const radius = component.querySelector('.handle').getBoundingClientRect().height / 2;

        // 旋转半径
        // TODO: 轴高+旋转点半径为一个常量，不需要动态取
        const rotateRadius = blockHeight / 2 + axelHeight + radius;

        const clientOffset = monitor.getClientOffset();
        const initialClientOffset = monitor.getInitialClientOffset();

        const blockCenterClientOffset = {
            x: initialClientOffset.x - rotateRadius * Math.sin(rotation * Math.PI / 180),
            y: initialClientOffset.y + rotateRadius * Math.cos(rotation * Math.PI / 180)
        }

        const rotateAngle = getAngleByThreeCoord(blockCenterClientOffset, initialClientOffset, clientOffset);

        props.hamster.blockManager.rotateEnd(fromJS({
            rotateAngle,
            blockId
        }));
    }
}

const collect = (monitor, connector) => ({
    rotateSource: connector.connect(),
    canRotate: monitor.canRotate()
})


@rotateSource('container', spec, collect)
@CSSModules(styles)
class RotateSection extends Component {
    static displayName = 'RotateSection'

    static propTypes = {
        canRotate: PropTypes.bool,
        rotateSource: PropTypes.func
    }

    render() {
        const {rotateSource} = this.props;

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

export default  RotateSection;
