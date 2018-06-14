import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import {fromJS} from 'immutable'
import {connect} from 'react-redux'

import rotateSource from '../decorator/operation/rotate';
import styles from './RotateSection.scss'
import * as miaow from '../../../Utils/miaow'
import blockActions from '../../../actions/block';

const spec = {
    beginRotate: (props) => {
        const {actStart} = props;
        actStart && actStart(fromJS({
            type: 'rotating'
        }))
    },

    canRotate: (props, monitor, component) => {
        const {active} = props;
        
        return active;
    },

    endRotate: (props, monitor, component) => {
        const {block, rotateEnd} = props;
        const blockId = block.get('id');
        const rotation = block.getIn(['data', 'props', 'rotation']);
        const blockHeight = block.getIn(['data', 'props', 'height']);
        const blockWidth = block.getIn(['data', 'props', 'width']);

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

        const rotateAngle = miaow.getAngleByThreeCoord.apply(null, [blockCenterClientOffset, initialClientOffset, clientOffset].map(miaow.getCoord));

        rotateEnd && rotateEnd(fromJS({
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
        rotateSource: PropTypes.func,
        config: PropTypes.object,
        block: PropTypes.object,
        active: PropTypes.bool,
        hamster: PropTypes.object,
        clickBlock: PropTypes.func,
        actStart: PropTypes.func,
        rotateEnd: PropTypes.func
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

const mapDispatchToProps = dispatch => {
    return {
        actStart: (payload) => dispatch(blockActions.actStart(payload)),
        rotateEnd: (payload) => dispatch(blockActions.rotateEnd(payload))
    }
}

export {RotateSection}
export default connect(null, mapDispatchToProps)(RotateSection);
