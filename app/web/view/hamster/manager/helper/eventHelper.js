// delete
export const onDeleteKey = (event, hamster) => {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    hamster.blockManager.blockDelete();
}

// ctrl + c
export const onCopy = (event, hamster) => {
    if (event.key !== 'c' || !event.ctrlKey) return;
    hamster.blockManager.copyBlocks();
}

// ctrl + v
export const onPaste = (event, hamster) => {
    if (event.key !== 'v' || !event.ctrlKey) return;
    hamster.blockManager.pasteBlocks();
}
