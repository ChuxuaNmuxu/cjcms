import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rotateSource from '../decorator/operation/rotate';
import CSSModules from 'react-css-modules'
import styles from './RotateSection.scss'
import {fromJS} from 'immutable'

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

        const offset = {
            x: clientOffset.x - blockCenterClientOffset.x,
            y: blockCenterClientOffset.y - clientOffset.y
        }

        // TODO: 计算的是最终旋转到的角度，也是上一版使用的方案，这样有个问题就是两个旋转不同角度的block在一起旋转后会变成同一个角度
        const rotateRadian = Math.atan(offset.x / offset.y);
        let rotateAngle = rotateRadian * 180 / Math.PI;

        // 修正旋转角在0-360之间
        if (offset.y < 0) {
            rotateAngle += 180;
        } else if (offset.y > 0 && offset.x < 0) {
            rotateAngle += 360;
        }

        props.hamster.blockManager.rotateEnd(fromJS({
            rotateAngle
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
