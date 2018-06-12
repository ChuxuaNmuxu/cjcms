import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CustomDragLayer from './CustomDragLayer';

export default class CustomLayer extends Component {
//   static propTypes = {
//     prop: PropTypes
//   }

  render() {
    return (
      <div>
          <CustomDragLayer />
      </div>
    )
  }
}
