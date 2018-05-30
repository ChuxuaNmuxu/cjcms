import manager from './resizeManager';
import decorateSource from '../base/decorateSource';
import createSource from './createSource';
// import createMonitor from './createMonitor';
import handleConnect from './handleConnect';

const resizeSource = (type, spec, collect) => {
    // TODO: params check

    return decorateSource({
        type,
        spec,
        collect,
        // createMonitor,
        createSource,
        handleConnect,
        manager
    })
}

export default resizeSource;
