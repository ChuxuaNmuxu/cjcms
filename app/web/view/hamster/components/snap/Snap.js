import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules';
import SnapLine from './SnapLine';

import {destruction} from '../../utils/miaow'
import { withHamster } from '../../manager';
import styles from './Snap.scss';

const mapStateToProps = ({hamster}) => {
    return {
        snapCoord: hamster.getIn(['current', 'snapCoord']),
        config: hamster.getIn(['data', 'snap'])
    }
}

@withHamster()
@connect(mapStateToProps)
@CSSModules(styles)
export default class Snap extends Component {
    static propTypes = {
        children: PropTypes.node,
        snapCoord: PropTypes.object,
        config: PropTypes.object
    }

    constructor (props, context) {
        super(props, context);

        this.state = {
            snapLines: []
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            snapLines: this.getSnapLines(nextProps)
        })
    }

    getSnapLines = (props) => {
        const {hamster} = props;
        const container = hamster.getContainer('slide');
        if (!container) return [];

        const {width, height} = container;
        const {snapCoord, config} = props;

        const [stroke = 1] = destruction('stroke')(config);
        const [x = [], y = []] = destruction('x', 'y')(snapCoord);

        const horizontalLines = x.map(v => ({
            left: 0,
            top: v,
            width,
            height: stroke
        }))

        const verticalLines = y.map(v => ({
            left: v,
            top: 0,
            width: stroke,
            height
        }))

        return verticalLines.concat(horizontalLines);
    }

    render() {
        const {children, config} = this.props;
        const {snapLines} = this.state;

        return (
            <div styleName='snap-lines' className='snap-lines'>
                {
                    snapLines.map((line, index) => <SnapLine
                      key={index}
                      config={config}
                      {...line}
                    />)
                }
                {children}
            </div>
        )   
    }
}
