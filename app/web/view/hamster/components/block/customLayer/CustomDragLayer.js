import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import {handleDrag} from '../../../reducers/helper/helper'
import {getOperatingBlockId} from '../../../reducers/helper/current'
import Block from '../../Viewport/Block'

const CustomDragLayer = props => {
    const {hamster, offset} = props
    const operatingBlockId = getOperatingBlockId(hamster);
    const hamsterDragged = handleDrag(hamster, fromJS({
        blockId: operatingBlockId,
        offset
    }))

    return <div />
}

CustomDragLayer.propTypes = {
    hamster: PropTypes.object
}

export default CustomDragLayer;
