import React from 'react'
import PropTypes from 'prop-types'
import ContainerSection from './ContainerSection'
import DragSection from './DragSection'
import ResizeSection from './ResizeSection'
import RotateSection from './RotateSection'
import lodash from 'lodash'
import uuid from 'uuid'

const keys = lodash.range(3).map(() => uuid.v4())

export default class BlockContainer extends React.Component {
    static propTypes = {
        config: PropTypes.object,
        block: PropTypes.object,
        children: PropTypes.node
    }

    constructor(props, context) {
        super(props, context);
        
        const {config={}} = props;
        
        this.ContainerSection = config.ContainerSection || ContainerSection
        this.DragSection = config.DragSection || DragSection
        this.ResizeSection = config.ResizeSection || ResizeSection
        this.RotateSection = config.RotateSection || RotateSection
    }

    render() {
        const components = [
            this.DragSection,
            this.RotateSection,
            this.ResizeSection
        ]

        const config = lodash.omit(this.props.config, [DragSection, ResizeSection, RotateSection, ContainerSection]);

        const childrens = components.map((Component, k) => React.cloneElement(
            <Component key={keys[k]} />,
            {...this.props, config}
        ))
        this.props.children && childrens.unshift(this.props.children)

        const Container = this.ContainerSection;
        return React.cloneElement(<Container />, {...this.props, config}, childrens)
    }
}
