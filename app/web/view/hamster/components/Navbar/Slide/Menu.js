import React from 'react';
import {Menu, message} from 'antd';
import {map} from 'lodash'

import { hideContextMenu } from '../../../../../component/ContextMenu';

/**
 * 添加卡片
 * position: before | after | first | last 四种情况
 * @param {*} hamster 
 * @param {*} payload 
 */
const handleAddSlide = (hamster, payload) => {
    let {target, position} = payload;
    if (target === 'slide') {
        position = position === 'header' ? 'before' : 'after'
    } else {
        position = position === 'header' ? 'first' : 'last'
    }
    hamster.slideManager.addSlide(null, {...payload, position});
}

/**
 * 添加卡片组
 * position: before | after | first | last 四种情况
 * @param {*} hamster 
 * @param {*} payload 
 */
const handleAddSlideGroup = (hamster, payload) => {
    let {target, position} = payload;
    if (target === 'pane') {
        position = position === 'body' ? 'last' : 'first'
    } else {
        position = position === 'header' ? 'before' : 'after'
    }
    hamster.slideManager.addSlideGroup(null, {...payload, position});
}

// 菜单配置
const menuConfig = {
    addSlide: {
        title: '添加卡片',
        handler: handleAddSlide
    },
    copySlide: {
        title: '复制卡片'
    },
    deleteSlide: {
        title: '删除卡片'
    },
    moveUpSlide: {
        title: '上移卡片',
        disabled: (hamster, {targetId}) => {
            return hamster.slideManager.isFirstSlide(targetId)
        },
    },
    moveDownSlide: {
        title: '下移卡片',
        disabled: (hamster, {targetId}) => {
            return hamster.slideManager.isLastSlide(targetId)
        },
    },
    // -----group-----
    addGroup: {
        title: '添加小节',
        handler: handleAddSlideGroup
    },
    copyGroup: {
        title: '复制小节',
        visible: (payload) => {
            return payload.position === 'header';
        },
    },
    deleteGroup: {
        title: '仅删除小节',
        visible: (payload) => {
            return payload.position === 'header';
        },
    },
    deleteRGroup: {
        title: '删除小节及卡片',
        visible: (payload) => {
            return payload.position === 'header';
        },
    },
    renameGroup: {
        title: '重命名',
        visible: (payload) => {
            return payload.position === 'header';
        },
        disabled: () => {}
    },
    moveUpGroup: {
        title: '上移小节',
        disabled: (hamster, {targetId}) => {
            return hamster.slideManager.isFirstSlideGroup(targetId)
        },
    },
    moveDownGroup: {
        title: '下移小节',
        disabled: (hamster, {targetId}) => {
            return hamster.slideManager.isLastSlideGroup(targetId)
        },
    }
}

// 显示配置
const displayConfig = {
    default: [
        'addSlide',
        'addGroup'
    ],
    'slide.body': [
        'addSlide',
        'copySlide',
        'deleteSlide',
        'moveUpSlide',
        'moveDownSlide',
        '-',
        'addGroup',
    ],
    'slide.group.header': [
        'renameGroup',
        'copyGroup',
        'addGroup',
        '-',
        'deleteGroup',
        'deleteRGroup',
        '-',
        'moveUpGroup',
        'moveDownGroup'
    ]
}

/**
 * 处理菜单项点击事件
 */
const handleContextMenuClick = (e, hamster, payload) => {
    hideContextMenu();
    const handler = menuConfig[e.key].handler;
    if (handler) {
        handler(hamster, payload)
    } else {
        message.warn('该功能尚未实现!');
    }
}

/**
 * 创建菜单项
 * @param {*} hamster 
 * @param {*} payload 
 */
const createContextMenu = (hamster, payload) => {
    const {target, position} = payload;
    const dd = displayConfig[target] || displayConfig[target + '.' + position] || displayConfig.default;
    return (<Menu theme='dark' onClick={e => handleContextMenuClick(e, hamster, payload)}>
        {map(dd, (key, i) => {
            if (key === '-') {
                // TODO：如果在两头或者前一个也是-，该-则不显示
                return <Menu.Divider key={key + i} />
            }
            const visible = menuConfig[key].visible;
            if (visible && !visible(payload)) {
                return null;
            }
            const disabledCallback = menuConfig[key].disabled;
            const disabled = !!(disabledCallback && disabledCallback(hamster, payload));
            return <Menu.Item key={key} disabled={disabled}>{menuConfig[key].title}</Menu.Item>
        })}
    </Menu>)
}

export default createContextMenu
