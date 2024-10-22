

export const selectArr = ["按图纸", "按清单", "其他"]



export function createInputDisabled(value: any) {

    return computed(() => {
        return value.value != selectArr[2];
    })

}


export function getInputValue(value: string) {

    let retVal = "";
    if (selectArr.indexOf(value) == -1) {
        retVal = value;
    }

    return retVal;

}

