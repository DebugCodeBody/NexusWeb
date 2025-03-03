

function callAsync(targrt: () => any, callback: () => void, callStatus: string = "then") {
  const callReturn = targrt();
  if (callReturn instanceof Promise) {
    // @ts-ignore
    return callReturn[callStatus](callback)
  } else {
    return callback();
  }

}

export function callFinallyFun(targrt: () => any, callback: () => void) {
  return callAsync(targrt, callback, "finally");
}

export function callThenFun(targrt: () => any, callback: () => void) {
  return callAsync(targrt, callback, "then");
}

export function callErrorFun(targrt: () => any, callback: () => void) {
  return callAsync(targrt, callback, "error");
}
