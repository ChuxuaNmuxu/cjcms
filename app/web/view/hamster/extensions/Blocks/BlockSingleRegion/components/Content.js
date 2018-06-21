import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Content.scss';

@CSSModules(styles)
export default class Content extends Component {
    render() {
        return <div styleName='single-selector' className='single-selector' />
    }
}
