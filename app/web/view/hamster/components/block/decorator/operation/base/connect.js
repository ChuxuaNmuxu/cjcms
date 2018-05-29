/**
 * 连接dom和backend
 * @input sourceId
 * @input domNode
 */

import {isEqual, reduce} from 'lodash';
import wrapConnector from './wrapConnector'

const createConnect = (config) => (manager) => {
    const Backend = manager.getBackend();

    let sourceId;
    let currentNode;
    let currentOptions;
    let disConnectSource;

    const registry = manager.getRegistry();
    
    const reConnectSource = (node, options) => {
        // 随props改变，connect函数会被经常触发
        if (node === currentNode && isEqual(options, currentOptions)) {
            return ;
        }

        currentNode = node;
        currentOptions = options

        // 连接到backend之前先清除原来的，每个sourceId在backend中只会存在一个，目前还不知道有啥用
        // if (disConnectSource) {
        //     disConnectSource();
        //     disConnectSource = null;
        // }

        if (currentNode && sourceId) {
            disConnectSource = Backend.connectSource(
                sourceId,
                node,
                options
            )
        }

    }

    const receiveId = id => {
        sourceId = id;
    }

    const handleConnectors = reduce(config, (accu, configOption, name) => {
        accu[name] = (node, options) => {
            const currentOptions = {...configOption, ...options}
            reConnectSource(node, currentOptions)
        }
        return accu;
    }, {})

    // const connector = wrapConnector({
    //     resizeNorth: (node, options) => {
    //         const currentOptions = {dir: 'north', ...options}
    //         reConnectSource(node, currentOptions)
    //     }
    // })

    return {
        receiveId,
        connector: wrapConnector(handleConnectors)
    }
}

export default createConnect;
