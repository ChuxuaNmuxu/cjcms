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
            color: `linear-gradient(
                to right,
                white,
                transparent 3%,
                transparent 97%,
                white 100%
            ),
            repeating-linear-gradient(
                to right,
                transparent,
                transparent 5px,
                #999 5px,
                #999 10px
            ),
            linear-gradient(
                to bottom,
                white,
                transparent 3%,
                transparent 97%,
                white 100%
            ),
            repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 5px,
                #999 5px,
                #999 10px
            )`
        }
    }

    getStyle = () => {
        const style = _.mapValues(_.pick(this.props, ['top', 'left', 'width', 'height']), addPx);

        // const {config: {color}} = this.props;
        const color = this.props.config.get('color');
        const background = color || SnapLine.defaultProps.config.color;
        return _.merge({}, {background}, style)
    }

    render() {
        const style = this.getStyle();
        return (
            <div styleName='grid-line' className='grid-line' style={style} />
        )
    }
}
