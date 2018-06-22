import React, { Component } from 'react'

export default class CustomLayer extends Component {
    shouldComponentUpdate (nextProps) {
        if (!this.props.entities.equals(nextProps.entities)) return true;
        return false;
    }
}
