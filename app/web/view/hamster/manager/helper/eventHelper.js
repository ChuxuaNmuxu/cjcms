import { getCurrentState } from "../../reducers/helper/current";
import { FOCUSAREA_NAV, FOCUSAREA_VIEWPORT } from "../../config/constants";

export const onDeleteKey = (event, hamster) => {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    hamster.blockManager.blockDelete();
}

export const onCopy = (event, hamster) => {
    if (event.key !== 'c' || !event.ctrlKey) return;
    hamster.blockManager.copyBlocks();
}

export const onPaste = (event, hamster) => {
    if (event.key !== 'v' || !event.ctrlKey) return;
    hamster.blockManager.pasteBlocks();
}
