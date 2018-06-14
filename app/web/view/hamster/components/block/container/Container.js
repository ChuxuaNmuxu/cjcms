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

const keys = lodash.range(3).map(() => uuid.v4())

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
        
        const {config=Map()} = props;
        
        [ this.DragSection, this.RotateSection, this.ResizeSection] = lodash.zip(
            ['draggable', 'resizable', 'rotatable'],
            [DragSection, ResizeSection, RotateSection]
        ).map(
            miaow.ultimate(lodash.last)(value => {
                const component = config.getIn(['container', lodash.head(value)]);
                if (component && miaow.isValidateReactComponent(component)) return component
            })
        )
    }

    render() {
        const components = [
            this.DragSection,
            this.RotateSection,
            this.ResizeSection
        ]

        const {config: contentConfig = Map()} = this.props;
        const containerConfig = contentConfig.get('container');

        const config = defaultContainerConfig.merge(containerConfig)

        const childrens = components.map((Component, k) => React.cloneElement(
            <Component key={keys[k]} />,
            {...this.props, config}
        ))
        this.props.children && childrens.unshift(this.props.children)

        // const Container = this.ContainerSection;
        return React.cloneElement(<ContainerSection />, {...this.props, config}, childrens)
    }
}
