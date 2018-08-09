import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {fromJS} from 'immutable'

import Container from '../../../../../components/block/container'
import ContainerSection from '../ContainerSection'

const config = fromJS({ // 单项配置
    editable: true, // 可编辑
    draggable: ContainerSection,
    rotatable: true, // 可旋转的
    resizable: false, // 可变尺寸
    animationEnable: true, // 可以附加动画
    questionEnable: true, // 可以转成习题
    groupEnable: true, // 可以组合
    contextMenu: {}, // 右键菜单
})

export default class GroupContainer extends Component {
    static propTypes = {
        active: PropTypes.bool
    }

    render() {
        const {active} = this.props;
        console.log(26, active)
        if (!active) return null;

        return (
            <Container {...this.props} config={config}/>
        )
    }
}
