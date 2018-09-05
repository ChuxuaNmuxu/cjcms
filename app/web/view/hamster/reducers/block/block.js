import {fromJS, Map} from 'immutable';
import lodash from 'lodash';

import * as helper from '../helper/helper';
import * as miaow from '../../utils/miaow';
import * as nodeHelper from '../helper/node';
import * as currentHelper from '../helper/current';
import * as entityHelper from '../helper/entity';
import * as blockHelper from '../helper/block';
import { ACT_DRAG, ACT_RESIZE, ACT_ROTATE } from '../../config/constants';

function handleAddBlock (hamster, action) {
    const {payload: {blocks}} = action;

    hamster = helper.handleAddBlock(hamster, blocks);
    return hamster;
}

/**
 * 拖拽结束
 * @param {*} hamster 
 * @param {*} action 
 */
function handleDragEnd (hamster, action) {
    hamster = helper.handleDrag(hamster, action.payload);
    // 移动的元素如果未激活，那么在移动结束后激活
    const operateBlockId = currentHelper.getOperatingBlockId(hamster);
    hamster = helper.activateBlock(hamster, operateBlockId, false);

    
    // 更新组合元素
    const [blocksToOperate] = miaow.destruction('blocksToOperate')(currentHelper.getActSituation(hamster))
    hamster = helper.updateAllGroupFourDimension(hamster, blocksToOperate);
    
    // current
    hamster = currentHelper.updateCurrent(hamster)('dragging')(false);
    hamster = currentHelper.updateCurrent(hamster)('snap.data')(null)

    return hamster;
}   

/**
 * 旋转
 * @param {*} hamster 
 * @param {*} action 
 */
function handleRotateEnd (hamster, action) {
    const {payload} = action;
    hamster = helper.handleRotate(hamster, payload);

    // current
    hamster = currentHelper.updateCurrent(hamster)('rotating')(false);

    return hamster;
}

/**
 * 拉伸
 * @param {*} hamster 
 * @param {*} action 
 */
function handleResizeEnd (hamster, action) {
    const {payload} = action;
    hamster = helper.handleResize(hamster, payload);

    // current
    hamster = currentHelper.updateCurrent(hamster)('resizing')(false);

    // 更新组合元素
    const activatedIds = currentHelper.getActivatedBlockIds(hamster);
    hamster = helper.updateAllGroupFourDimension(hamster, activatedIds);

    return hamster
}

// 点击元素
function handleClickBlock (hamster, action) {
    // 激活元素
    const {payload: {event={}, blockId}} = action;
    /**
     * 处理嵌套
     * @description 嵌套元素是个虚拟的元素，在被激活之后，对节点的操作将没有影响，
     * @version 1.0
     * 在未激活状态时，优先激活祖先元素；节点元素激活，祖先元素必然处于激活状态
     * 1. 非叶子节点元素，不做处理
     * 2. 祖先节点未激活，激活祖先元素
     * 3. 节点元素操作时，祖先元素必然处于激活状态
    */

    /**
     * 具体实现
     * @deprecated
     * @version 1.0
     * 1. 判断出待激活的节点
     * 2. activeIds中去除ancestorid,在不考虑ancestor的情况下处理，在结束时再补充
     * 3. 按普通激活逻辑处理
    */

    /**
     * @version 1.1
     * 1. 多选点击已激活元素，不取消激活
     * 2. 组合对内透明，对外表现为一个完整的元素
     * 	    inside：祖先元素 === 1
	 *      outside：祖先元素 > 1
     */

    /**
     * 具体实现
     * @deprecated
     * @version 1.1
     * 1. 组合元素的攘外安内：判断激活元素
     *  对外：没有叶子元素
     *  对内：只有单个祖先及其叶子元素，同vision1.0
     * 2. ctrlKey：控制操作符
     *  ctrl + 已激活: handleCancelActivateBlocks
     *  ctrl + 未激活：handleActivateBlocks
     *  没有ctrl：handleReactivateBlocks
    */
    
    /**
     * 具体实现
     * @version 1.2
     * 形式判断 -> 激活元素判断 -> 操作符判断
    */
    hamster = helper.activateBlock(hamster, blockId, event.ctrlKey);

    hamster = currentHelper.updateCurrent(hamster)('operatingBlockId')(blockId);

    return hamster;
}

/**
 * 组合元素
 */
function handleUnite (hamster, actions) {
    const activeblockIds = currentHelper.getActivatedBlockIds(hamster);
    /**
     * 处理嵌套的情况
     * 1. 嵌套取祖先元素
    */
    // 孤立节点与祖先节点
    const childrenIds = currentHelper.forceMaybeAncestorsInCurrent(hamster);

    // 生成defaultGroupObject
    const entityId = helper.createId('block-');
    hamster = helper.createDefaultBlockObjects(hamster, entityId);

    // 初始大小及位置
    const idCluster = currentHelper.getIdCluster(hamster, activeblockIds);
    hamster = blockHelper.updateGroupFourDimension(hamster, idCluster, entityId);

    // 修改children属性
    hamster = entityHelper.handleEntitiesChanges(hamster, fromJS({
        ids: entityId,
        operations: {'data.children': miaow.replaceAs(childrenIds)}
    }))

    // 加入indexs
    // TODO: 新增block逻辑
    hamster = hamster.updateIn(['index', 'blocks'], miaow.add(entityId));
    
    // 修改blocks的parent属性
    hamster = entityHelper.handleEntitiesChanges(hamster, fromJS({
        ids: childrenIds,
        operations: {'data.parent': miaow.replaceAs(entityId)}
    }))

    // 删除中间节点
    // TODO: 删除元素逻辑
    hamster = hamster = hamster.updateIn(['index', 'blocks'], miaow.filter(miaow.not(nodeHelper.isMidsideNode)(hamster)))
    
    // 重激活组合元素
    hamster = helper.handleReactivateBlocks(hamster)(entityId);

    // 叶子 transform-origin
    // hamster = blockHelper.updateOriginTransformOrigin(hamster)(entityId);

    return hamster;
}

/**
 * drag or resize or rotate begin
 * @param {*} hamster 
 * @param {*} action 
 */
function handleActStart (hamster, action) {
    const {payload} = action;
    const type = payload.get('type');
    const blockId = payload.get('blockId');

    hamster = currentHelper.updateCurrent(hamster)(type)(true);
    hamster = currentHelper.updateCurrent(hamster)('operatingBlockId')(blockId);

    /**
     * 操作形式判断
     * 操作过程中(handleDrag, handleResize, handleRotate)将用到，但只需在操作前(actStart)判断一次就行
     * 不需要在操作中一直计算
    */
    let actType = ACT_DRAG;
    if (/resiz/.test(type)) actType = ACT_RESIZE;
    if (/rotat/.test(type)) actType = ACT_ROTATE;

    const situation = currentHelper.getSituation(hamster, blockId, actType);
    hamster = currentHelper.updateCurrent(hamster)('actSituation')(fromJS(situation));

    // drag开始，组合元素不显示
    if (actType === ACT_DRAG) hamster = currentHelper.updateCurrent(hamster)('blocks')(miaow.filter(miaow.not(nodeHelper.isAncestor(hamster))));
    return hamster;
}

/**
 * 框选
 * @param {*} hamster 
 * @param {*} action 
 */
function handleBoxSelect (hamster, action) {
    const {payload} = action;
    // TODO: 缩小范围为当前slide的block
    const [top, left, width, height] = miaow.destruction('top', 'left', 'width', 'height')(payload)
    const bottom = top + height;
    const right = left + width;

    // const blockIds = hamster.get('entities').filter(entity => )
    const blockIdsInSlide = currentHelper.getAllBlockIdsInOperatingSlide(hamster);
    const blockIdsToActivated = blockIdsInSlide.filter(blockId => {
        const box = blockHelper.packageBlocks(hamster)(blockId);
        return box.top < bottom && top < box.bottom && box.right > left && right > box.left
    })

    // 去掉叶子元素，只保留祖先元素
    const rightBlocks = currentHelper.forceMaybeAncestors(hamster)(blockIdsToActivated);

    hamster = helper.handleReactivateBlocks(hamster)(rightBlocks);

    return hamster;
}

function handleDeleteBlock (hamster, action) {
    const activateIds = currentHelper.getActivatedBlockIds(hamster);
    hamster = blockHelper.deleteBlocks(hamster)(activateIds);
    return hamster;
}

// 复制元素，只是将元素id保存到current.copy
const handleCopyBlocks = (hamster, action) => {
    hamster = lodash.flow(
        currentHelper.getActivatedBlockIds,
        currentHelper.updateCurrent(hamster)('copy')
    )(hamster)
    return hamster;
}

/**
 * paste
 * @param {*} hamster 
 * @param {*} action 
 */
const pasteOffset = 5;

const handlePasteBlocks = (hamster, action) => {
    const blocks = lodash.flow(
        currentHelper.getCurrentState(hamster),
        miaow.toList,
        miaow.mapI(lodash.flow(
            // 拿到block
            entityHelper.getEntity(hamster),
            // 更新id, 位置等
            entityHelper.udpateEntity(fromJS({
                'id': helper.createId('block'),
                'data.props.top': miaow.add(pasteOffset),
                'data.props.left': miaow.add(pasteOffset),
            }))
        ))
    )('copy')
    
    hamster = handleAddBlock(hamster, {
        payload: {blocks}
    })
    
    // TODO: 更新zIndex
    const newBlockIds = blocks.map(miaow.get('id'));

    // TODO: 粘贴组合

    // 激活复制后的元素
    hamster = helper.handleReactivateBlocks(hamster)(newBlockIds);

    // 更新copy, 下次直接粘贴时会再偏移pasteOffset
    hamster = handleCopyBlocks(hamster)
    return hamster;
}

export const block = {
    'ADD': handleAddBlock,
    'DRAG_END': handleDragEnd,
    'CLICK': handleClickBlock,
    'GROUP_UNITE': handleUnite,
    'ROTATE_END': handleRotateEnd,
    'RESIZE_END': handleResizeEnd,
    'BLOCK_DELETE': handleDeleteBlock,
    'ACT_START': handleActStart,
    'BOX_SELECT': handleBoxSelect,
    'COPY': handleCopyBlocks,
    'PASTE': handlePasteBlocks
}
