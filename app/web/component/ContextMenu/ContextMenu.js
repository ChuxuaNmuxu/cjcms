import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';

import './ContextMenu.scss';

/**
 * 右键菜单类
 */
class ContextMenu {
    constructor (Menu = null) {
        this.Menu = Menu;
        this.onContextMenu = this.onContextMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }

    /**
     * 设置菜单
     * @param {Component} Menu 菜单组件
     */
    setMenu (Menu) {
        this.Menu = Menu;
    }

    /**
     * 隐藏菜单
     */
    hideMenu () {
        if (this.tooltip) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            document.body.removeChild(this.shade)
            document.body.removeChild(this.cmContainer)
            this.shade = null;
            this.cmContainer = null;
            this.tooltip = null;
        }
    }

    getContainer () {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            this.shade = document.createElement('div');
            document.body.appendChild(this.cmContainer);
            document.body.appendChild(this.shade);
            this.shade.addEventListener('click', this.hideMenu)
        }
        return this.cmContainer;
    }

    /**
     * 右键点击事件
     * @param {*} e 事件
     */
    onContextMenu (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.tooltip) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            ReactDOM.unmountComponentAtNode(this.shade);
            this.tooltip = null;
        }

        this.tooltip = (
            <Tooltip
              placement='rightTop'
              trigger='click'
              defaultVisible
              overlay={this.Menu}
              prefixCls='cj-contextmenu'>
                <span />
            </Tooltip>
        );
        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
            position: 'absolute',
            left: `${e.pageX}px`,
            top: `${e.pageY}px`
        });
        Object.assign(this.shade.style, {
            position: 'fixed',
            left: `0`,
            top: `0`,
            width: '100%',
            height: '100%',
            zIndex: '999999',
            backgroundColor: 'red',
            opacity: 0,
            pointerEvents: 'none'
        });
        ReactDOM.render(this.tooltip, container);
    }
}

let contextMenu;

/**
 * 快捷函数，如与其它组件共用一个右键弹出框，用此函数
 * @param {*} e 事件
 * @param {*} Menu 菜单
 */
export const onContextMenu = (e, Menu) => {
    if (!contextMenu) {
        contextMenu = new ContextMenu();
    }
    contextMenu.setMenu(Menu);
    contextMenu.onContextMenu(e);
}

/**
 * 快捷函数，隐藏右键菜单，隐藏共用右键弹出框
 */
export const hideContextMenu = () => {
    if (!contextMenu) {
        contextMenu = new ContextMenu();
    }
    contextMenu.hideMenu();
}

export default ContextMenu;
