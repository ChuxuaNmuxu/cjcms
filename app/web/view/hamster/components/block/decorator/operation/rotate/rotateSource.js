import manager from './core';
import createSource from './createSource';
import createMonitor from './createMonitor';
import handleConnect from './handleConnect';
import decorateSource from '../base/decorateSource';

const rotateSource = (type, spec, collect, options={}) => {
    // TODO: params check

    return decorateSource({
        type,
        spec,
        collect,
        options,
        createMonitor,
        createSource,
        handleConnect,
        manager
    })
}

export default rotateSource;
