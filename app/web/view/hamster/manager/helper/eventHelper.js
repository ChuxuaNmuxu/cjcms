import { getCurrentState } from "../../reducers/helper/current";
import { FOCUSAREA_NAV, FOCUSAREA_VIEWPORT } from "../../config/constants";

export const onDeleteKey = (event, hamster) => {
    if (event.key !== 'Delete') return;
    const focusArea = getCurrentState(hamster.getHamsterState())('focusArea');
    if (focusArea === FOCUSAREA_NAV) {
        // TODO: 删除导航图片(slide)
    } else if (focusArea === FOCUSAREA_VIEWPORT) {
        // 删除block
        hamster.blockManager.blockDelete()
    }
}
