import lodash from 'lodash'

import { getActivatedBlockIds, updateCurrent, cancelActivateBlocksInCurrent } from "../helper/current";
import { handleCancelActivateBlocks } from "../helper/helper";
import { FOCUSAREA_NAV } from '../../config/constants';

const handleMouseDown = (hamster, actions) => {
    hamster = cancelActivateBlocksInCurrent(hamster);
    
    // 更新focusArea
    hamster = updateCurrent(hamster)('focusArea')(FOCUSAREA_NAV) 
    return hamster;
}

export const nav = {
    'MOUSEDOWN': handleMouseDown
}
