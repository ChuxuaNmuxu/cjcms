import {isValidElement, cloneElement} from 'react'
import {reduce} from 'lodash';

const cloneWithRef = (element, ref) => {
    const previousRef = element.ref;

    ref = previousRef ? node => {ref(node), previousRef(node)} : ref

    console.log('ref: ', ref)
    console.log('element: ', element)

    return cloneElement(element, {ref})
}

const wrapConnector = (connects) => {
    return reduce(connects, (accu, handle, k) => {
        /**
         * TODO: 
         * node校验
         */
        accu[k] = () => (node, options) => {
            if (!isValidElement(node)) return;

            const ref = options ? node => handle(node, options) : handle;
            return cloneWithRef(node, ref);
        };
        return accu;
    }, {})
}

export default wrapConnector;
