import {fromJS} from 'immutable';
import block from './block'

/**
 * 默认block配置
 */
export const defaultBlockConfig = fromJS(block);

/**
 * 内置block列表
 */
export const blocks = fromJS([]);

const config = {
    toolbar: {
        block: {
            more: ['line']
        }
    }
}

export default config;