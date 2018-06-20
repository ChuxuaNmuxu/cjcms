import React from 'react'

import Block from '../block'
import {ContainerSection, ResizeSection, RotateSection, DragSection} from '../block/container';

const Box = props => {
    return <Block.Component {...props}>
        <ContainerSection {...props}>
            <ResizeSection {...props}/>
            <RotateSection {...props}/>
            <DragSection {...props}/>
        </ContainerSection>
    </Block.Component>
}

export default Box