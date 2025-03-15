const Hook = {};

Hook.defineProperty = function (obj, key, interceptors) {


    let thisValue = obj[key];

    Object.defineProperty(obj, thisValue, {
        get() {
            return thisValue;
        },
        set(value) {

            thisValue = value;

        }
    })





}