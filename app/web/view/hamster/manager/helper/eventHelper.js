export const onDeleteKey = (event, hamster) => {
    if (event.key !== 'Delete') return;
    console.log(2, event.key)
    hamster.blockManager.blockDelete()
}
