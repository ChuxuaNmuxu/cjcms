import {fromJS} from 'immutable';
import block from './block'

import {default as slideConfig} from './slide'

export const slide = fromJS(slideConfig);

/**
 * 默认block配置
 */
export const defaultBlockConfig = fromJS(block);

/**
 * 内置block列表
 */
export const blocks = fromJS([]);


export const toolbar = {
    // 块元素区域
    blockArea: {
        // 显示在更多区域的块元素
        more: ['test', 'test2', 'test3', 'test4', 'test5']
    }
}
