import {fromJS} from 'immutable';

const add = unit => value => `${value}${unit}`;
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
    'animationDuration': {
        formatter: addMs
    },
    'animationDelay': {
        formatter: addMs
    }
}

export default fromJS(styleConfig);
