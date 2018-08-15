import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';

import styles from './SnapLine.scss';
import {addPx} from '../../utils/miaow';
import _ from 'lodash'

@CSSModules(styles)
export default class SnapLine extends Component {
    static propTypes = {
        top: PropTypes.number,
        left: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        color: PropTypes.number
    }

    static defaultProps = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        config: {
            color: 'yellow'
        }
    }

    getStyle = () => {
        const style = _.mapValues(_.pick(this.props, ['top', 'left', 'width', 'height']), addPx);

        // const {config: {color}} = this.props;
        const color = this.props.config.get('color');
        const backgroundColor = color || SnapLine.defaultProps.config.color;
        return _.merge({}, {backgroundColor}, style)
    }

    render() {
        const style = this.getStyle();
        return (
            <div styleName='grid-line' className='grid-line' style={style} />
        )
    }
}
