import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prevParseConfig from './helper';
import ContainerSection from '../ContainerSection'
import DragSection from '../DragSection'
import ResizeSection from '../ResizeSection'
import RotateSection from '../RotateSection'
import { isValidateReactComponent, destruction } from '../../../../utils/miaow';

class Container extends Component {
    static propTypes = {
        config: PropTypes.any,
        children: PropTypes.node,
        block: PropTypes.object,
        active: PropTypes.bool,
        clickBlock: PropTypes.func
    };
    
    render() {
        const config = prevParseConfig(this.props.config);

        if (!config) return null;

        if (isValidateReactComponent(config)) {
            const Container = config;
            return <Container {...this.props} />
        }

        const {children, block, active} = this.props;
        const [dragConfig, rotateConfig, resizeConfig] = destruction('draggable', 'rotatable', 'resizable')(config)

        console.log(37, rotateConfig)

        const containerProps = {block, active}
        const props = {block, active, children}
        return (
            <ContainerSection {...containerProps}>
                <DragSection config={dragConfig} {...props} />
                <ResizeSection config={resizeConfig} {...props}/>
                <RotateSection config={rotateConfig} {...props}/>
            </ContainerSection>
        );
    }
}

export default Container;
