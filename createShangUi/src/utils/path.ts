


export const fileSuffix = [
    ".step",
    ".stp",
    ".sldprt",
    ".stl",
    ".sat",
    ".3dxml",
    ".prt",
    ".itp",
    ".catpart",
    ".x_t",
    ".ptc",
    ".x_b",
    ".dws",
    ".dwf",
    ".dwg",
    ".dxf",
    ".pdf",
    ".zip"
];


export function basename(path: string) {


    let retVal: string | undefined;

    const index = path.lastIndexOf(".");

    if (index > -1) {
        retVal = path.slice(index);
    }

    return retVal;
}



export function isZip(value: string) {
    return basename(value) === ".zip";
}

export function isPermitFle(name: string) {


    let retValue = false;
    const suffixName = basename(name);

    if (suffixName && fileSuffix.indexOf(suffixName) > -1) {
        retValue = true;
    }

    return retValue;


}