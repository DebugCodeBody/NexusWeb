

function getButton() {

    const allPop = document.querySelectorAll<HTMLElement>(".el-overlay");

    let retEl = ([] as HTMLElement[]).find.call(allPop, (elem: HTMLElement) => {

        return elem.style.display != 'none'

    })
    if (retEl) {

        retEl = retEl.querySelector<HTMLElement>(".el-dialog .el-dialog__footer button:last-child") as any;

    }





    return retEl;
}

function onKeydown(event: KeyboardEvent) {

    if (!event.ctrlKey || event.key != "s") {
        return;
    }

    event.preventDefault();
    event.stopPropagation();


    /** 默认焦点在确认按钮上 */
    const button = getButton();
    if (button) {
        button.click();
    }

}

export function onOpenEd() {

    /** 默认焦点在确认按钮上 */
    const button = getButton();
    if (button) {
        button.focus();
    }

    window.addEventListener("keydown", onKeydown);

}

export function onCloseEd() {

    window.removeEventListener("keydown", onKeydown);

}