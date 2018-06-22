import React from 'react'
import PropTypes from 'prop-types'
import ContainerSection from './ContainerSection'
import DragSection from './DragSection'
import ResizeSection from './ResizeSection'
import RotateSection from './RotateSection'
import lodash from 'lodash'
import uuid from 'uuid'
import {Map} from 'immutable'
import * as miaow from '../../../Utils/miaow'
import defaultBlockConfig from '../../../config/block'
const defaultContainerConfig = Map(defaultBlockConfig.content.container)

export default class BlockContainer extends React.Component {
    static propTypes = {
        config: PropTypes.object,
        children: PropTypes.node,
        block: PropTypes.object,
        active: PropTypes.bool,
        clickBlock: PropTypes.func
    }

    constructor(props, context) {
        super(props, context);

        /**
         * DragSection, RotateSection, ResizeSection三个组件获取顺序
         * children(displayName) 复用内部组件，主要用于自定义钩子函数
         * config： 从配置中获取，来自第三方
         * 默认组件，带有connect的业务相关的钩子
         * */
        const {children} = props;

        const {config=Map()} = props;
        
        [ this.DragSection, this.RotateSection, this.ResizeSection] = lodash.zip(
            ['draggable', 'resizable', 'rotatable'],
            [DragSection, ResizeSection, RotateSection]
        ).map(
            miaow.ultimate(lodash.last)(
                value => {
                    if (React.Children.count(children) <= 1) return;
                    let component = null;
                    React.Children.forEach(child => {
                        if(child.displayName === lodash.last(value).displayName) {
                            component = child;
                        }
                    })
                    if (component && miaow.isValidateReactComponent(component)) return component

                },
                value => {
                    const component = config.getIn(['container', lodash.head(value)]);
                    if (component && miaow.isValidateReactComponent(component)) return component
                }
            )
        )

        this.keys = lodash.range(3).map(() => uuid.v4())
    }

    render() {
        const components = [
            this.DragSection,
            this.RotateSection,
            this.ResizeSection
        ]

        const {config: contentConfig = Map(), children} = this.props;
        const containerConfig = contentConfig.get('container');

        const config = defaultContainerConfig.merge(containerConfig)

        let childrens = components.map((Component, k) => React.cloneElement(
            <Component key={this.keys[k]} />,
            {...this.props, config}
        ))

        if (children) {
            const restChildrens = React.Children.toArray(children).filter(child => !['DragSection', 'ResizeSection', 'RotateSection'].includes(child.displayName))
            childrens = childrens.concat(restChildrens)
        }

        // const Container = this.ContainerSection;
        return React.cloneElement(<ContainerSection />, {...this.props, config}, childrens)
    }
}
