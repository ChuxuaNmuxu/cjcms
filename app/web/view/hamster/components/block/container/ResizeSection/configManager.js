/**
 * 可变尺寸
 * resizable: ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']
 * @config resizable 配置
 *  {bool} 开启 | 关闭
 *  {array} ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']
 */

import defaultBlockConfig from '../../../../config/block';
import { alwaysFalse, identity, dispatchMission, always } from '../../../../utils/miaow';
import { List } from 'immutable';
const defaultResizeConfig = defaultBlockConfig.content.container.resizable;

const isTrue = config => {
    if (config !== true) return;

    return defaultResizeConfig;
}

const isFalse = config => {
    if (config !== false) return;

    return [];
}

const isArray = config => {
    if (!List.isList(config)) return;

    return config;
}

const others = always(defaultResizeConfig);

export default function (config) {
    const resizeConfig = dispatchMission(
        isTrue,
        isFalse,
        isArray,
        others
    )(config)

    return resizeConfig.reduce((accu, v) => {
        accu[v] = true;
        return accu
    }, {})
}
