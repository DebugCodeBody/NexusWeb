class StorageBase<T = any> {

    constructor(public name: string, public defauleValue: T) {



    }


    get() {

        let retVal: T;
        try {

            let getValue = localStorage.getItem(this.name) as any as {
                value: T
            };

            if (getValue) {
                getValue = JSON.parse(getValue as any);
            }

            retVal = getValue.value;

        } catch {
            retVal = this.defauleValue;
        }

        return retVal;

    }

    set(value: T) {

        localStorage.setItem(this.name, JSON.stringify({
            value
        }))

    }

}

export default StorageBase;