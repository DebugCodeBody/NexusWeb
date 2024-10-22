

const loginErrKey = "nexus_loginerr"

export function setLoginError(value: string) {
    localStorage.setItem(loginErrKey, value);
}

export function getLoginError() {

    let error = localStorage.getItem(loginErrKey);
    localStorage.removeItem(loginErrKey);
    return error || "";
}