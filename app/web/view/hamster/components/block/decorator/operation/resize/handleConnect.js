// 连接dom，附加信息

import createConnect from '../base/connect';

const resizeConnect = {
    resizeNorth: {dir: 'n'},
    resizeSouth: {dir: 's'},
    resizeEast: {dir: 'e'},
    resizeWest: {dir: 'w'},
    resizeNW: {dir: 'nw'},
    resizeNE: {dir: 'ne'},
    resizeSW: {dir: 'sw'},
    resizeSE: {dir: 'se'}
}

export default createConnect(resizeConnect)
