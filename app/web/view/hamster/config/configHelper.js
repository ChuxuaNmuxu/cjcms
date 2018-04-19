import {List} from 'immutable';

import * as extensions from './extensions';
import * as config from './config';

/**
 * 配置管理类
 */
class ConfigHelper {
    blocks;

    constructor () {
        this.init();
    }

    init () {
        this.initBlocks();
    }

    initBlocks () {
        let blocks = config.blocks.concat(extensions.blocks || List([]));
        this.blocks = blocks.map(block => config.defaultBlockConfig.mergeDeep(block));
    }

    getBlock (name) {
        return this.blocks.find(block => block.get('name') === name)
    }
}

export default new ConfigHelper();
