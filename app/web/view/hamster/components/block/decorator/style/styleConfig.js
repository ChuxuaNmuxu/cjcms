import {fromJS} from 'immutable';
import { always } from '../../../../utils/miaow';

export const add = unit => value => `${value}${unit}`;
const addPx = add('px');
const addMs = add('ms')

const styleConfig = {
    'left': {
        formatter: addPx
    },
    'top': {
        formatter: addPx
    },
    'width': {
        formatter: addPx
    },
    'height': {
        formatter: addPx
    },
    'borderWidth': {
        formatter: addPx
    },
    'rotation': {
        name: 'transform',
        formatter: (value) => `rotate(${value}deg)`
    },
    'textDecoration': {
        formatter: (value) => value && value.join(' ')
    },
    'fontSize': {
        formatter: addPx
    },
    'opacity': {
        formatter: (value) => `${value / 100}`
    },
    'duration': {
        name: 'animationDuration',
        formatter: addMs
    },
    'delay': {
        name: 'animationDelay',
        formatter: addMs
    },
    'effect': {
        name: 'animationName'
    },
    'trigger': {
        formatter: always(null)
    },
    'index': {
        formatter: always(null)
    }
}

export default fromJS(styleConfig);
