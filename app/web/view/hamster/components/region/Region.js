/**
 * 画框框
 * 基于slide和block组件开发
 * TODO: 提供onFinish接口，如在componentWillUnmount中，可以完成截图功能等
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './Region.scss'
import uuid from 'uuid'
import Immutable, {fromJS} from 'immutable';

import Slide from '../slide'
import { getBox, shallowEqual, map, getCoord, destruction, get } from '../../utils/miaow';
// import getEmptyImage from '../block/decorator/operation/base/getEmptyImage';
import {getEmptyImage} from '@ssm1982/cj-react-dnd'
import {ContainerSection, ResizeSection, RotateSection, DragSection} from '../block/container';
import { handleDragBlock, handleResizeBlocks, handleRotateBlocks } from '../../reducers/helper/helper';
import prevParseConfig from './helper';

const getEntityAndIds = (regions) => {
    if (!regions) return [];

    const blockIds = regions.map(get('id'));
    const entities = regions.reduce((entity, region) => entity.set(region.get(id), region), Immutable.Map())
    return [blockIds.toOrderedSet(), entities]
}

@CSSModules(styles)
class Region extends Component {
    static propTypes = {
        exact: PropTypes.bool,
        regions: PropTypes.any,
        beginDrag: PropTypes.func,
        endDrag: PropTypes.func,
        onFinish: PropTypes.func,
        onChange: PropTypes.func,
        getContainer: PropTypes.func
    }

    block = null;
    operatingId = null;
    clientCoord = null;
    initialClientCoord = null;
    isSelectRegion = false;

    constructor(props, context) {
        super(props, context);

        const {blockType='text'} = props;
        this.defaultBlock = Immutable.fromJS({
            type: 'block',
            data: {
                type: blockType,
                props: {
                    rotation: 0
                }
            }
        })

        // 注入配置
        
        const [dragConfig, rotateConfig, resizeConfig, ContentComponent] = prevParseConfig(blockType);

        const BoxComponent = blockProps => <ContainerSection {...blockProps}>
                    <ContentComponent {...blockProps} />
                    <DragSection config={dragConfig} beginDrag={this.handleActStart} drag={this.handleDragBlock}/>
                    <RotateSection config={rotateConfig} beginRotate={this.handleActStart} rotate={this.handleRotateBlock}/>
                    <ResizeSection config={resizeConfig} beginResize={this.handleActStart} resize={this.handleResizeBlock}/>
                </ContainerSection>
            

        const {regions, activatedIds} = props;
        const [blockIds, entities] = getEntityAndIds(regions)

        this.state = {
            blockIds: blockIds || Immutable.OrderedSet(),
            activatedIds: activatedIds || Immutable.List(),
            entities: entities || Immutable.Map(),
            BoxComponent
        }
    }

    componentWillReceiveProps (nextProps) {
        const {regions, activatedIds} = nextProps;

        if (regions) {
            const [blockIds, entities] = getEntityAndIds(regions)
            this.setState({
                blockIds,
                entities
            })
        }

        if (activatedIds) this.setState({activatedIds})
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
        const params = [fromJS({entities: this.initialEntities})].concat(destruction('blockId', 'direction', 'offset')(payload));
        const hamster = handleResizeBlocks.apply(null, params)
        this.setState({
            entities: hamster.get('entities')
        })
    }

    handleRotateBlock = (payload) => {
        const params = [fromJS({entities: this.initialEntities})].concat(destruction('blockId', 'rotateAngle')(payload))
        const hamster = handleRotateBlocks.apply(null, params);

        this.setState({
            entities: hamster.get('entities')
        })
    }

    getRegionList = () => {
        const {blockIds, entities} = this.state;
        const regionList = blockIds.map(id => entities.get(id));
        return regionList;
    }

    handleDragStart = e => {
        // e.dataTransfer.effectAllowed = "copy"

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
        this.operatingId = id;
        this.isSelectRegion = true;
        this.block = this.defaultBlock.set('id', id)

        const {beginDrag} = this.props;
        beginDrag && beginDrag(entities);
    }

    handleRegion = (initialClientCoord, clientCoord) => {
        if (!this.isSelectRegion) return;
        const id = this.block.get('id');

        const fourDimension = getBox.apply(null, map(getCoord)([initialClientCoord, clientCoord]));
        this.block = this.block.mergeDeep(Immutable.fromJS({
            data: {
                props: {
                    ...fourDimension,
                    top: fourDimension.top - this.containerPosition.top,
                    left: fourDimension.left - this.containerPosition.left,
                }
            }
        }))
        
        const {blockIds, entities} = this.state;
        this.setState({
            blockIds: blockIds.add(id),
            entities: entities.set(id, this.block)
        })
    }

    handleDragover = e => {
        // 去除禁止符号
        e.preventDefault()
        if (!this.isSelectRegion) return;

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
        if (!this.isSelectRegion) return;

        // 新的block加入entities
        this.setState({
            activatedIds: Immutable.fromJS([this.operatingId]),
        })
        
        const {onChange} = this.props;
        onChange && onChange(this.block.getIn(['data', 'props']), this.getRegionList());

        // 重置
        this.clientCoord = null;
        this.isSelectRegion = false;
        this.block = this.defaultBlock;
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
              // 鼠标从框上出来时，去除禁止符号
              onDragEnter={e => e.preventDefault()}
            //   onDrop={e => e.dataTransfer.dropEffect = 'copy'}
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
