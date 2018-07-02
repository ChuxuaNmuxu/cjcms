import React from 'react';
import { shallowEqual } from '../../../utils/miaow';
import {omit} from 'lodash'

export default class PureContainerComponent extends React.Component {
    shouldComponentUpdate (nextProps) {
        // 自定义容器
        const prevProps = omit(this.props, 'children');
        const props = omit(nextProps, 'children');

        return !shallowEqual(prevProps, props)
    }
}
