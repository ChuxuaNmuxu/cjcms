import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prevParseConfig from './helper';
import ContainerSection from '../ContainerSection'
import DragSection from '../DragSection'
import ResizeSection from '../ResizeSection'
import RotateSection from '../RotateSection'
import { isValidateReactComponent, destruction } from '../../../../Utils/miaow';

class Container extends Component {
    static propTypes = {
        config: PropTypes.any,
        children: PropTypes.node,
        block: PropTypes.object,
        active: PropTypes.bool,
        clickBlock: PropTypes.func
    };

    config;
    constructor(props, context) {
        super(props, context);

        this.config = prevParseConfig(props.config);
    }
    
    render() {
        if (!this.config) return null;

        if (isValidateReactComponent(this.config)) {
            const Container = this.config;
            return <Container {...props} />
        }

        const {children, block, active} = this.props;
        const [dragConfig, rotateConfig, resizeConfig] = destruction('draggable', 'rotatable', 'resizable')(this.config)

        return (
            <ContainerSection block={block} active={active}>
                {children}
                <DragSection config={dragConfig} block={block}/>
                <ResizeSection config={resizeConfig} block={block}/>
                <RotateSection config={rotateConfig} block={block}/>
            </ContainerSection>
        );
    }
}

export default Container;
