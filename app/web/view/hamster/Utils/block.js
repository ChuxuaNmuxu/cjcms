import {fromJS, Map, List} from 'immutable';
import uuid from 'uuid';

import {HAMSTER} from '../../../actions/actionTypes'
import blockActions from '../actions/block'
import * as miaow from '../Utils/miaow'
import {createEntity} from './entity'

/**
 * 递归提取block属性
 * @param {*} block
 */
const extractBlockProps = (block) => {
    return block.get('props')
        .reduce(
            (reduction, v, k) => reduction.set(k, v.has('props') ? extractBlockProps(v) : v.get('value')),
            Map()
        )
}

/**
 * 从配置中提取数据
 */
const extractBlockData = (block) => {
    let data = (block.get('data') || Map()).merge({
        type: block.get('name'),
        props: extractBlockProps(block)
    });

    return createEntity('block', data);
}

export {
    extractBlockData
}
