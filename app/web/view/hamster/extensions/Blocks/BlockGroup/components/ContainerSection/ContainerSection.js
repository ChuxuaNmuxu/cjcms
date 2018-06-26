import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';

import styles from './ContainerSection.scss';

@CSSModules(styles)
export default class ContainerSection extends Component {
    static propTypes = {
        config: PropTypes.any,
        dragSource: PropTypes.func
    }

    render() {
        const {dragSource, children} = this.props;

        return (
            <div styleName='group-container-wrap' className='group-container-wrap'>
                {children}
                {
                    dragSource(<div className="top" />)
                }
                              {
                    dragSource(<div className="right" />)
                }
                              {
                    dragSource(<div className="bottom" />)
                }
                {
                    dragSource(<div className="left" />)
                }
            </div>
        )
    }
}
