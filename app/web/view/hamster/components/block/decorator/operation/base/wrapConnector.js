import {isValidElement, cloneElement} from 'react'
import {reduce} from 'lodash';

const cloneWithRef = (element, ref) => {
    const previousRef = element.ref;

    ref = previousRef ? node => {ref(node), previousRef(node)} : ref

    return cloneElement(element, {ref})
}

const wrapConnector = (connects) => {
    return reduce(connects, (accu, handle, k) => {
        /**
         * TODO: 
         * node校验
         */

        // 为了调用collect时传入的函数引用是同一个，单独定义函数
        const connectHandle = (node, options) => {
            if (!isValidElement(node)) return;
        
            const ref = options ? node => handle(node, options) : handle;
            return cloneWithRef(node, ref);
        }

        accu[k] = () => connectHandle;
        return accu;
    }, {})
}

export default wrapConnector;
