/**
 * 画框框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './Region.scss'
import uuid from 'uuid'
import Immutable, {fromJS} from 'immutable';

import Slide from '../slide'
import Box from './Box';
import { getBox, shallowEqual, map, getCoord, destruction } from '../../Utils/miaow';
import getEmptyImage from '../block/decorator/operation/base/getEmptyImage';
import Block from '../block'
import {ContainerSection, ResizeSection, RotateSection, DragSection} from '../block/container';
import { handleDragBlock, handleResizeBlocks, handleRotateBlocks } from '../../reducers/helper/helper';

const defalutBlock = Immutable.fromJS({
    type: 'block',
    data: {
        type: 'text'
    }
})

@CSSModules(styles)
class Region extends Component {
    static propTypes = {
        exact: PropTypes.bool,
        regions: PropTypes.array,
        beginDrag: PropTypes.func,
        endDrag: PropTypes.func,
        onFinish: PropTypes.func,
        onChange: PropTypes.func,
        getContainer: PropTypes.func
    }

    newBlockId = null;
    operatingId = null;
    clientCoord = null;
    initialClientCoord = null;
    isRegioning = false;

    constructor(props, context) {
        super(props, context);

        const BoxComponent = props => <Block.Component {...props}>
                <ContainerSection {...props}>
                    <DragSection {...props} beginDrag={this.handleActStart} drag={this.handleDragBlock}/>
                    <RotateSection {...props} beginRotate={this.handleActStart} rotate={this.handleRotateBlock}/>
                    <ResizeSection {...props} beginResize={this.handleActStart} resize={this.handleResizeBlock}/>
                </ContainerSection>
            </Block.Component>

        this.state = {
            blockIds: Immutable.OrderedSet(), 
            activatedIds: Immutable.List(),
            entities: Immutable.Map(),
            BoxComponent
        }
    }


    handleActStart = () => {
        this.initialEntities = this.state.entities;
    }

    handleDragBlock = (payload) => {
        const hamster = handleDragBlock(fromJS({entities: this.initialEntities}), payload)
        this.setState({
            entities: hamster.get('entities')
        })
    }

    handleResizeBlock = (payload) => {
        const params = [fromJS({entities: this.initialEntities})].concat(destruction(payload, 'blockId', 'direction', 'offset'));
        const hamster = handleResizeBlocks.apply(null, params)
        this.setState({
            entities: hamster.get('entities')
        })
    }

    handleRotateBlock = (payload) => {
        const params = [fromJS({entities: this.initialEntities})].concat(destruction(payload, 'blockId', 'rotateAngle'))
        const hamster = handleRotateBlocks.apply(null, params);

        this.setState({
            entities: hamster.get('entities')
        })
    }

    handleDragStart = e => {
        this.initialClientCoord = {
            x: e.clientX,
            y: e.clientY
        }
        
        // 可以框选
        const {exact, canDrag} = this.props;
        const {entities} = this.state;
        if (exact && !e.target.dataset.exact) return;
        if (canDrag && !canDrag(entities)) return;

        // 幽灵
        e.dataTransfer.setDragImage(getEmptyImage(), 0, 0)
        
        // container位置
        const {getContainer} = this.props;
        const node = getContainer && getContainer() ? getContainer() : this.container.parentNode;
        this.containerPosition = node.getBoundingClientRect();
        
        // 更新一些信息
        const id = 'region-' + uuid.v4()
        this.newBlockId = id;
        this.operatingId = id;
        this.isRegioning = true;
        
        const {beginDrag} = this.props;
        beginDrag && beginDrag(Immutable.fromJS(this.block), entities);
    }

    handleRegion = (initialClientCoord, clientCoord) => {
        if (!this.isRegioning) return;

        const fourDimension = getBox.apply(null, map(getCoord)([initialClientCoord, clientCoord]));
        
        const {blockIds, entities} = this.state;
        const {newBlockId: id} = this;
        const block = Immutable.fromJS({
            type: 'block',
            id,
            data: {
                type: 'text',
                props: {
                    ...fourDimension,
                    top: fourDimension.top - this.containerPosition.top,
                    left: fourDimension.left - this.containerPosition.left,
                    rotation: 0
                }
            }
        })

        this.setState({
            blockIds: blockIds.add(id),
            entities: entities.set(id, block)
        })
    }

    handleDragover = e => {
        // 去除禁止符号
        e.preventDefault()
        if (!this.isRegioning) return;

        const clientCoord = {
            x: e.clientX,
            y: e.clientY
        }
        if (shallowEqual(this.clientCoord, clientCoord)) return;
        
        // client offset
        const {initialClientCoord} = this;
        this.clientCoord = clientCoord;

        this.handleRegion(initialClientCoord, clientCoord)
    }

    handleDragEnd = e => {
        if (!this.isRegioning) return;

        // 新的block加入entities
        this.setState({
            activatedIds: Immutable.fromJS([this.operatingId]),
        })
        
        const {onChange} = this.props;
        onChange && onChange(this.block, this.state.entities);

        // 重置
        this.clientCoord = null;
        this.isRegioning = false;
        this.block = {};
    }

    render() {
        const {children} = this.props;
        const {blockIds, activatedIds, entities, BoxComponent} = this.state;
        return (
            <div
              data-exact
              styleName='region'
              className='region'
              ref = {e => this.container = e}
              draggable='true'
              onDragStart={this.handleDragStart}
            //   onDrag={this.handleDrag}
              onDragOver={this.handleDragover}
              onDragEnd={this.handleDragEnd}
              onDragEnter={e => e.preventDefault()}
            >
                {children}
                <Slide.Component
                  blockIds={blockIds}
                  activatedIds={activatedIds}
                  entities={entities}
                  Block={BoxComponent}
                />
            </div>
        )
    }
}

export default Region;
