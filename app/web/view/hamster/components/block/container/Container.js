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

const keys = lodash.range(3).map(() => uuid.v4())

export default class BlockContainer extends React.Component {
    static propTypes = {
        config: PropTypes.object,
        block: PropTypes.object,
        children: PropTypes.node
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

        const {config: containerConfig = Map()} = this.props;

        const config = containerConfig.filter((v, k) => !Reflect.has(['draggable', 'resizable', 'rotatable'], k));

        console.log('containerConfig; ', containerConfig.toJS())
        console.log('config; ', config.toJS())

        const childrens = components.map((Component, k) => React.cloneElement(
            <Component key={keys[k]} />,
            {...this.props, config}
        ))
        this.props.children && childrens.unshift(this.props.children)

        // const Container = this.ContainerSection;
        return React.cloneElement(<ContainerSection />, {...this.props, config}, childrens)
    }
}
